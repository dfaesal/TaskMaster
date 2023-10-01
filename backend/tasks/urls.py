from django.urls import path
from . import views, views_authentication as auth

urlpatterns = [
    # ...
    path('register/', auth.register, name='register'),
    path('login/', auth.login, name='login'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/', views.UserDetailView.as_view(), name='user-detail'),
    path('create/', views.CreateTaskView.as_view(), name='create-task'),
    path('view/', views.TaskListAPIView.as_view(), name='view-task'),
    path('view/<int:task_id>/', views.TaskDetailView.as_view(), name='view-task-detail'),
    path('update_task/<int:task_id>/', views.TaskUpdateAPIView.as_view(), name='update-task'),
    #path('update_task_status/<int:task_id>/', views.TaskStatusUpdateAPIView.as_view(), name='update_task_status'),
    #path('update_task_priority/<int:task_id>/', views.TaskPriorityUpdateAPIView.as_view(), name='update_task_priority'),
    #path('assign_task/<int:task_id>/', views.TaskAssignmentAPIView.as_view(), name='assign_task'),
]