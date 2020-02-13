from django.shortcuts import render, redirect

# Create your views here.


def index(request):
    return render(request, "review.pug")


def review(request):
    LIST = request.GET.get('list')
    if LIST is None:
        return redirect('/review?list=0')

    return render(request, "review.pug")
