from django.urls import path
from django.urls import include

from .views import IndexView
from .views import AboutView
from .views import MenuView
from .views import BookView
from .views import BookingsView

urlpatterns = [
    path('', IndexView.as_view(), name='home'),
    path('about/', AboutView.as_view(), name='about'),
    path('menu/', MenuView.as_view(), name='menu'),
    path('book/', BookView.as_view(), name='book'),
    path('reservations/', BookingsView.as_view(), name='reservations'),
]
