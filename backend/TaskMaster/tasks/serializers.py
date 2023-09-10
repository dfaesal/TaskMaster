from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['In Progress', 'Completed', 'On Hold'])