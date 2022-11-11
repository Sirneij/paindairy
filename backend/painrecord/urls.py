from django.urls import include, path
from painrecord import views
from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'', views.PainRecordViewSet, basename='painrecord')

# The API URLs are now determined automatically by the router.
app_name = 'painrecord'
urlpatterns = [
    path('', include(router.urls)),
]
