from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['In Progress', 'Completed', 'On Hold'])

class TaskPriorityUpdateSerializer(serializers.Serializer):
    PRIORITY_CHOICES = (
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    )

    priority = serializers.ChoiceField(choices=PRIORITY_CHOICES)

class TaskAssignmentSerializer(serializers.Serializer):
    task_id = serializers.IntegerField()
    username = serializers.CharField()