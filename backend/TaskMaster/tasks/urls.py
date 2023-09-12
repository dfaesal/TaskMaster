from django.urls import path
from .views import CreateTaskView, TaskListAPIView, TaskStatusUpdateAPIView, TaskPriorityUpdateAPIView, TaskAssignmentAPIView

urlpatterns = [
    # ...
    path('create/', CreateTaskView.as_view(), name='create-task'),
    path('view/', TaskListAPIView.as_view(), name='view-task'),
    path('update_task_status/<int:task_id>/', TaskStatusUpdateAPIView.as_view(), name='update_task_status'),
    path('update_task_priority/<int:task_id>/', TaskPriorityUpdateAPIView.as_view(), name='update_task_priority'),
    path('assign_task/', TaskAssignmentAPIView.as_view(), name='assign_task'),
]