from django.shortcuts import render

# Create your views here.
def index(request):
  return render(request, 'index.html')

def map(request):
  return render(request, 'map.html')

def about(request):
  return render(request, 'about.html')

def calculate(request):
  return render(request, 'calculate.html')