from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import User, Parent, Teacher, Student, Admin
from .serializers import UserSerializer, ParentSerializer, StudentSerializer, TeacherSerializer, AdminSerializer
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from django.conf import settings


# Create your views here.
User = get_user_model()

# Create your views here.
class Register(APIView):
    def post(self, request, format=None):
        data = request.data

        if User.objects.filter(username=data.get("username")).exists():
            return Response(
                {"error": "Username already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create the base user
        user = User.objects.create_user(
            username=data.get("username"),
            email=data.get("email", ""),
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            password=data.get("password"),
        )

        # Assign user type and create profile
        user_type = data.get("user_type")  # expected: student, teacher, admin

        if user_type == "student":
            Student.objects.create(user=user)
        elif user_type == "teacher":
            Teacher.objects.create(user=user)
        elif user_type == "parent":
            Parent.objects.create(user=user)
        elif user_type == "admin":
            user.is_staff = True
            user.is_superuser = True
            user.save()

        # Serialize basic user data
        serializer = UserSerializer(user)

        # Add user_type dynamically in response
        response_data = serializer.data
        response_data["user_type"] = user_type

        return Response({"user": response_data}, status=status.HTTP_201_CREATED)

class Login(APIView):
    def post(self, request, format=None):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.is_active:
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login Successful",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            return Response({"message": "User is not active"}, status=status.HTTP_403_FORBIDDEN)

        return Response({"message": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            # Expect the client to send the refresh token
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # requires token_blacklist app enabled
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)

class UserList(APIView):
    permission_classes = [permissions.IsAdminUser] 

    def get(self, request, format=None):

        user = User.objects.all()
        serializer = UserSerializer(user, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
        permission_classes = [permissions.IsAuthenticated]

        data = request.data
        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def _get_id(self, pk, format=None):

        user = User.objects.get(pk=pk)
        return user   

    def get(self, request, pk, format=None):

        user = self._get_id(pk=pk) 
        serializer = UserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk, format=None):

        user = self._get_id(pk=pk)
        data = request.data
        serializer = UserSerializer(user, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):

        user = self._get_id(pk=pk)
        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
class AdminProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        try:
            admin_profile = request.user.admin_profile
        except Admin.DoesNotExist:
            return Response({"error": "Admin profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminSerializer(admin_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, format=None):
        try:
            admin_profile = request.user.admin_profile
        except Admin.DoesNotExist:
            return Response({"error": "Admin profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminSerializer(admin_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        try:
            admin_profile = request.user.admin_profile
        except Admin.DoesNotExist:
            return Response({"error": "Admin profile not found"}, status=status.HTTP_404_NOT_FOUND)

        admin_profile.delete()
        return Response({"message": "Admin profile deleted"}, status=status.HTTP_204_NO_CONTENT)
    

# -------------------------
# Parent Profile
# -------------------------
class ParentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            parent = request.user.parent_profile
        except Parent.DoesNotExist:
            return Response({"error": "Parent profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ParentSerializer(parent)
        return Response(serializer.data)

    def put(self, request):
        try:
            parent = request.user.parent_profile
        except Parent.DoesNotExist:
            return Response({"error": "Parent profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ParentSerializer(parent, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Teacher Profile
# -------------------------
class TeacherProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            teacher = request.user.teacher_profile
        except Teacher.DoesNotExist:
            return Response({"error": "Teacher profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TeacherSerializer(teacher)
        return Response(serializer.data)

    def put(self, request):
        try:
            teacher = request.user.teacher_profile
        except Teacher.DoesNotExist:
            return Response({"error": "Teacher profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TeacherSerializer(teacher, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Student Profile
# -------------------------
class StudentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            student = request.user.student_profile
        except Student.DoesNotExist:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentSerializer(student)
        return Response(serializer.data)

    def put(self, request):
        try:
            student = request.user.student_profile
        except Student.DoesNotExist:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

