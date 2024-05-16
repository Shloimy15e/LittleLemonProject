from django.urls import path
from django.urls import include
from .views import MenuViewSet
from .views import BookingViewSet

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('menu', MenuViewSet, basename='menu')
router.register('bookings', BookingViewSet, basename='booking')

urlpatterns = [
      path('', include(router.urls))
]
