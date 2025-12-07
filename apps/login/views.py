from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request=request, template_name='login/index.html')

# def pick(request):
#     return render(request=request, template_name='apps/pick/index.html')