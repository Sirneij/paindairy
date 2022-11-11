from django.contrib.auth.tokens import PasswordResetTokenGenerator
from six import text_type


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    """Generate token for user activation."""

    def _make_hash_value(self, user, timestamp):  # type: ignore
        """Hash the value."""
        return text_type(user.id) + text_type(timestamp) + text_type(user.email_confirmed)


account_activation_token = AccountActivationTokenGenerator()
