from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer
from .models import Task
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import TaskStatusUpdateSerializer, TaskPriorityUpdateSerializer, TaskAssignmentSerializer

class CreateTaskView(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        data = request.data
        user = data.get('assigned_to')
        if user:
            try:
                userId = User.objects.get(username=user)
                data['assigned_to'] = userId.id
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            assigned_to_id = data['assigned_to']
            if assigned_to_id:
                try:
                    user = User.objects.get(pk=assigned_to_id)
                    data['assigned_to'] = user.username
                except User.DoesNotExist:
                    pass
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskListAPIView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        tasks = Task.objects.all()
        if not tasks.exists():
            return Response({'message': 'No tasks available for this user.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(tasks, many=True)
        data = serializer.data
        # Modify the JSON data to change assigned_to to username
        for task_data in data:
            assigned_to_id = task_data['assigned_to']
            if assigned_to_id:
                try:
                    user = User.objects.get(pk=assigned_to_id)
                    task_data['assigned_to'] = user.username
                except User.DoesNotExist:
                    pass

        return Response(data, status=status.HTTP_200_OK)

class TaskStatusUpdateAPIView(APIView):
    def patch(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)#, user=request.user)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TaskStatusUpdateSerializer(data=request.data)
        if serializer.is_valid():
            new_status = serializer.validated_data['status']
            if task.status != new_status:
                task.status = new_status
                task.save()
                return Response({'message': 'Task status updated successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No changes made to task status.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskPriorityUpdateAPIView(APIView):
    def patch(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)#, user=request.user)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskPriorityUpdateSerializer(data=request.data)
        if serializer.is_valid():
            new_priority = serializer.validated_data['priority']
            if task.priority != new_priority:
                task.priority = new_priority
                task.save()
                return Response({'message': 'Task priority updated successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'No changes made to task priority.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskAssignmentAPIView(APIView):
    def post(self, request):
        serializer = TaskAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            task_id = serializer.validated_data['task_id']
            username = serializer.validated_data['username']

            try:
                task = Task.objects.get(id=task_id)
            except Task.DoesNotExist:
                return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

            try:
                team_member = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': 'Team member not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Check if the task is already assigned to the selected team member
            if task.assigned_to == team_member:
                return Response({'message': 'Task is already assigned to the selected team member.'}, status=status.HTTP_200_OK)

            # Update the task's assignment
            task.assigned_to = team_member
            task.save()

            # Notify the team member about the new task assignment

            return Response({'message': 'Task assigned successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)