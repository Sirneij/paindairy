from typing import Any, Optional

from accounts import tasks
from accounts.models import User
from accounts.renderers import UserJSONRenderer
from accounts.serializers import (
    LoginSerializer,
    LogoutSerializer,
    RegistrationSerializer,
    UserSerializer,
)
from accounts.tokens import account_activation_token
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.http import HttpResponseRedirect
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = RegistrationSerializer

    def post(self, request: Request) -> Response:
        """Return user response after a successful registration."""
        user_request = request.data.get('user', {})
        serializer = self.serializer_class(data=user_request)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(email=user_data['email'])
        subject = 'Please Activate Your Account'
        ctx = {
            'fullname': user.get_full_name(),
            'domain': str(get_current_site(request)),
            'uid': urlsafe_base64_encode(force_bytes(user.id)),
            'token': account_activation_token.make_token(user),
            'frontend_app': settings.CORS_ALLOWED_ORIGINS[0],
        }

        if settings.DEBUG:
            tasks.send_email_message.delay(
                subject=subject,
                template_name='accounts/activation_request.txt',
                user_id=user.id,
                ctx=ctx,
            )
        else:
            tasks.send_email_message.delay(
                subject=subject,
                template_name='accounts/activation_request.html',
                user_id=user.id,
                ctx=ctx,
            )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = (AllowAny,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = LoginSerializer

    def get(self, request, format=None):
        user = User.objects.prefetch_related('pain_records')
        serializer = LoginSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        """Return user after login."""
        user = request.data.get('user', {})

        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = UserSerializer

    def retrieve(self, request: Request, *args: dict[str, Any], **kwargs: dict[str, Any]) -> Response:
        """Return user on GET request."""
        serializer = self.serializer_class(request.user, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request: Request, *args: dict[str, Any], **kwargs: dict[str, Any]) -> Response:
        """Return updated user."""
        serializer_data = request.data.get('user', {})

        serializer = self.serializer_class(
            request.user, data=serializer_data, partial=True, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class ActivateUserView(APIView):
    def get(self, request: Request, *args: dict[str, Any], **kwargs: dict[str, Any]) -> Optional[Response]:
        """Activate user."""
        try:
            user_uiid = force_str(urlsafe_base64_decode(self.kwargs['uidb64']))
            user = User.objects.get(id=user_uiid)
        except (TypeError, ValueError, OverflowError):
            user = None
        if user is not None and account_activation_token.check_token(user, self.kwargs['token']):
            user.email_confirmed = True
            if not user.is_doctor:
                user.is_active = True
                user.save(update_fields=['email_confirmed', 'is_active'])
            else:
                user.save(update_fields=['email_confirmed'])
                subject = 'PainDairy Account Notification...'
                ctx = {
                    'fullname': user.get_full_name(),
                    'frontend_app': settings.CORS_ALLOWED_ORIGINS[0],
                }
                if settings.DEBUG:
                    tasks.send_email_message.delay(
                        subject=subject,
                        template_name='accounts/message_doctor.txt',
                        user_id=user.id,
                        ctx=ctx,
                    )
                else:
                    tasks.send_email_message.delay(
                        subject=subject,
                        template_name='accounts/message_doctor.html',
                        user_id=user.id,
                        ctx=ctx,
                    )
            subject = 'User creation notification.'
            context = {
                'full_name': f'{user.full_name}',
                'username': f'{user.username}',
                'email': f'{user.email}',
                'is_doc': bool(user.is_doctor),
                'biography': f'{user.bio}',
                'qualification': f'{user.get_qualification_display()}',
                'frontend_app': settings.CORS_ALLOWED_ORIGINS[0],
            }
            if settings.DEBUG:
                tasks.send_email_message_general.delay(
                    subject=subject,
                    template_name='accounts/email/admin/message.txt',
                    recipient_list=[a[1] for a in settings.ADMINS],
                    ctx=context,
                )
            else:
                tasks.send_email_message_general.delay(
                    subject=subject,
                    template_name='accounts/email/admin/message.html',
                    recipient_list=[a[1] for a in settings.ADMINS],
                    ctx=context,
                )
            return HttpResponseRedirect(f'{settings.CORS_ALLOWED_ORIGINS[0]}/accounts/activated')

        elif user is None or not account_activation_token.check_token(user, self.kwargs['token']):
            return HttpResponseRedirect(f'{settings.CORS_ALLOWED_ORIGINS[0]}/accounts/expired')
        return Response({}, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    serializer_class = LogoutSerializer

    permission_classes = (IsAuthenticated,)

    def post(self, request: Request) -> Response:
        """Validate token and save."""
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
