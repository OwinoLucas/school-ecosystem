from django.urls import path
from .views import Register, Login, Logout, UserList, UserDetail



urlpatterns = [
    # Authentication
    path('register/', Register.as_view(), name="register"),
    path('login/', Login.as_view(), name="login"),      
    path('logout/', Logout.as_view(), name="logout"),   

    # User endpoints
    path('users/', UserList.as_view(), name="user_list"),
    path('user/<int:pk>/', UserDetail.as_view(), name="user_detail"),

    
    
]
