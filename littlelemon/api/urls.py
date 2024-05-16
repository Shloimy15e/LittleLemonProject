from django.urls import path
from django.urls import include
from .views import MenuViewSet
from .views import BookingViewSet

from rest_framework.routers import DefaultRouter

app_name = 'api'

router = DefaultRouter()
router.register('menu', MenuViewSet, basename='menu')
router.register('bookings', BookingViewSet, basename='bookings')

urlpatterns = [
      path('', include(router.urls))
]
