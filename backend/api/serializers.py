from rest_framework import serializers
from api.models import Book,CustomUser,Issues


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['name','email','password','college','address','phone']
        extra_kwargs={
            'password':{'write_only':True}
        }
    def validate(self,attr):
        if CustomUser.objects.filter(email=attr.get('email')).exists():
            raise serializers.ValidationError("Email already exists")
        return attr
    def create(self,validated_data):
        return CustomUser.objects.create_user(**validated_data)
    
class GetBookSerializer(serializers.ModelSerializer):
    class Meta:
        model=Book
        fields="__all__"
    
class IssuedBooksSerializer(serializers.ModelSerializer):
    class Meta:
        model=Issues
        fields="__all__"

class UserLoginSerializer(serializers.ModelSerializer):
    email=serializers.EmailField()
    class Meta:
        model=CustomUser
        fields=['email','password']

class ReturnIssueBookSerializer(serializers.ModelSerializer):
    class Meta:
        model=Issues
        fields=['return_date','returned']