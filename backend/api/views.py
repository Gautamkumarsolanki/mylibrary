from django.shortcuts import render
from rest_framework import viewsets
from api.models import Book,Issues,CustomUser
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from api.serializers import UserRegistrationSerializer,GetBookSerializer,IssuedBooksSerializer,UserLoginSerializer,ReturnIssueBookSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
# Create your views here.


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegisterViewSet(APIView):
    def post(self,request,format=None):
        serializer=UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user=serializer.save()
            token=get_tokens_for_user(user)
            return Response({'token':token,"user":serializer.data},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class BookViewSet(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,format=None):
        queryset=Book.objects.all()
        serializer=GetBookSerializer(queryset,many=True)
        return Response(serializer.data)
    def post(self,request,format=None):
        new_book=Book(name=request.data["name"],genre=request.data["genre"])
        new_book.save()
        return Response({"msg":"book added"})
    
class IssueBookViewSet(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,format=None):
        if request.user:
            user=CustomUser.objects.get(email=request.user.email)
            issued_books=user.issues_set.all()
            serializer=IssuedBooksSerializer(issued_books,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response({'msg':'Invalid User'},status=status.HTTP_401_UNAUTHORIZED)
    def post(self,request,format=None):
        if request.user:
            user=CustomUser.objects.get(email=request.user.email)
            book=Book.objects.get(id=request.data["id"])
            new_Issue=Issues(issue_date=timezone.now().date(),return_date=timezone.now().date(),bookname=request.data['name'],returned=False,user=user,book=book)
            new_Issue.save()
            return Response({"id":new_Issue.id,"date":new_Issue.issue_date})
        else:
            return Response({'msg':'Invalid User'},status=status.HTTP_401_UNAUTHORIZED)
class LoginViewSet(APIView):
    def post(self,request,format=None):
        serializer=UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email=serializer.data.get('email')
            password=serializer.data.get('password')
            user=authenticate(email=email,password=password)
            if user is not None:
                token=get_tokens_for_user(user)
                return Response({'token':token,'user':serializer.data},status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors':['Email or password is invalid']}},status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class ReturnBookViewSet(APIView):
    permission_classes = [IsAuthenticated]
    def put(self,request,id,format=None):
        queryset=Issues.objects.get(id=id)
        if request.user:
            serializer=ReturnIssueBookSerializer(queryset,data={
                "return_date":timezone.now().date(),'returned':True
            })
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({'date':serializer.data.get('return_date')},status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        else:
                return Response({'msg':'Invalid User'},status=status.HTTP_401_UNAUTHORIZED)