from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    #user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateField()
    STATUS_CHOICES = [
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('On Hold', 'On Hold'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='To Do')
    assigned_to = models.ForeignKey(User, related_name='assigned_tasks', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.title