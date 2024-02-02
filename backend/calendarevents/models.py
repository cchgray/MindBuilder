from django.db import models
from django.contrib.auth import get_user_model
from accounts.models import TrainingGroup

User = get_user_model()

class CalendarEvent(models.Model):

    TYPE_CHOICES = [
        ('Breathing', 'Blue'),
        ('Focus/Concentration', 'Green'),
        ('Stress Management', 'Orange'),
        ('Reflection', 'Yellow'),
        ('Imagery/Visualization', 'Red'),
        ('Goal Setting', 'Purple'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    title = models.CharField(max_length=256)
    description = models.TextField(blank=True, null=True)
    coach = models.CharField(max_length=255, blank=True, null=True)
    group = models.ForeignKey(TrainingGroup, on_delete=models.SET_NULL, blank=True, null=True)  # Link to TrainingGroup model
    #complete = models.BooleanField(default=False)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, blank=True, null=True)
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

class UserEventStatus(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(CalendarEvent, on_delete=models.CASCADE)
    complete = models.BooleanField(default=False) 