from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth import get_user_model

class UserAccountManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, role, about, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, role=role, about=about, **extra_fields)

        user.set_password(password)
        user.save()

        return user
    
    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, first_name, last_name, password, **extra_fields)


class UserAccount(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('coach', 'Coach'),
        ('player', 'Player'),
        ('admin', 'Admin'),
    )
    
    def get_pending_coach_requests(self):
        return CoachRequest.objects.filter(receiver=self, status='pending')

    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    about = models.CharField(blank=True, max_length=2000)  # Allow the field to be optional
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='player')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role', 'about']

    def get_full_name(self):
        return self.first_name

    def get_short_name(self):
        return self.first_name
    
    def __str__(self):
        return self.email
    
class CoachRequest(models.Model):
    sender = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='received_requests')
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('denied', 'Denied')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Coach Request from {self.sender.get_full_name()} to {self.receiver.get_full_name()}"

class CoachAssignment(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='coach_assignments')
    coach = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='assigned_players')
    request = models.OneToOneField(CoachRequest, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.coach.get_full_name()}'s Assigned Player: {self.user.get_full_name()}"

class TrainingGroup(models.Model):
    name = models.CharField(max_length=255)
    about = models.CharField(max_length=2000, blank=True)
    coach = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='coached_groups')
    users = models.ManyToManyField(get_user_model(), related_name='training_groups')

    def __str__(self):
        return self.name 