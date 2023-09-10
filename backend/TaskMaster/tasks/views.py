from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TaskSerializer
from .models import Task
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import TaskStatusUpdateSerializer

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
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskListAPIView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        tasks = Task.objects.all()
        if not tasks.exists():
            return Response({'message': 'No tasks available for this user.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TaskStatusUpdateAPIView(APIView):
    def patch(self, request, task_id):
        #print(f'user:{request.user}')
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