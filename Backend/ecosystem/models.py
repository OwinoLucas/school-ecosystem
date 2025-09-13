from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    USER_TYPES = [
        ("PARENT", "Parent"),
        ("TEACHER", "Teacher"),
        ("STUDENT", "Student"),
        ("ADMIN", "Admin"),
    ]
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default="STUDENT")

    def __str__(self):
        return f"{self.username} ({self.user_type})"



class Admin(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="admin_profile")
    username = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.username

#TODO remove username, name and surname fields as they are already in User model and email field
class Parent(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="parent_profile")
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} {self.surname}"


class Teacher(models.Model):
    SEX_CHOICES = [
        ("MALE", "Male"),
        ("FEMALE", "Female"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="teacher_profile")
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    img = models.ImageField(upload_to="teachers/", null=True, blank=True)
    blood_type = models.CharField(max_length=5, null=True, blank=True)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    birthday = models.DateField()

    def __str__(self):
        return f"{self.name} {self.surname}"


class Grade(models.Model):
    level = models.IntegerField(unique=True)

    def __str__(self):
        return f"Grade {self.level}"


class Class(models.Model):
    name = models.CharField(max_length=100, unique=True)
    capacity = models.IntegerField()
    supervisor = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name="supervised_classes")
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name="classes")

    def __str__(self):
        return f"{self.name} (Grade {self.grade.level})"


class Student(models.Model):
    SEX_CHOICES = [
        ("MALE", "Male"),
        ("FEMALE", "Female"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile")
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)
    address = models.CharField(max_length=255)
    img = models.ImageField(upload_to="students/", null=True, blank=True)
    blood_type = models.CharField(max_length=5)
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name="students")
    student_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="students")
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name="students")
    birthday = models.DateField()

    def __str__(self):
        return f"{self.name} {self.surname}"


class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)
    teachers = models.ManyToManyField(Teacher, related_name="subjects")

    def __str__(self):
        return self.name


class Lesson(models.Model):
    DAY_CHOICES = [
        ("MONDAY", "Monday"),
        ("TUESDAY", "Tuesday"),
        ("WEDNESDAY", "Wednesday"),
        ("THURSDAY", "Thursday"),
        ("FRIDAY", "Friday"),
    ]

    name = models.CharField(max_length=100)
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="lessons")
    student_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="lessons")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="lessons")

    def __str__(self):
        return f"{self.name} - {self.day}"


class Exam(models.Model):
    title = models.CharField(max_length=100)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="exams")

    def __str__(self):
        return self.title


class Assignment(models.Model):
    title = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    due_date = models.DateTimeField()
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="assignments")

    def __str__(self):
        return self.title


class Result(models.Model):
    score = models.IntegerField()
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, null=True, blank=True, related_name="results")
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, null=True, blank=True, related_name="results")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="results")

    def __str__(self):
        return f"{self.student} - {self.score}"


class Attendance(models.Model):
    date = models.DateField()
    present = models.BooleanField(default=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendances")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="attendances")

    def __str__(self):
        return f"{self.student} - {self.date} - {'Present' if self.present else 'Absent'}"


class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    student_class = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True, related_name="events")

    def __str__(self):
        return self.title


class Announcement(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    student_class = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True, related_name="announcements")

    def __str__(self):
        return self.title
