from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings

from ..models import Item
from ..permissions import HasItem1Permission, HasItem2Permission, HasItem3Permission

class Item1ReportView(APIView):
    permission_classes = [IsAuthenticated, HasItem1Permission]

    def get(self, request):
        item = get_object_or_404(Item, pk=settings.ITEM1_ID)
        # Reporting logic here, using the 'item' instance
        return Response({"message": f"Report from {item.name}"})

class Item1SummaryView(APIView):
    permission_classes = [IsAuthenticated, HasItem1Permission]

    def get(self, request):
        item = get_object_or_404(Item, pk=settings.ITEM1_ID)
        # Summary logic here, using the 'item' instance
        return Response({"message": f"Summary from {item.name}"})

class Item2ResizeView(APIView):
    permission_classes = [IsAuthenticated, HasItem2Permission]

    def get(self, request):
        item = get_object_or_404(Item, pk=settings.ITEM2_ID)
        # Resize logic here, using the 'item' instance
        return Response({"message": f"Resize from {item.name}"})

class Item2ConvertView(APIView):
    permission_classes = [IsAuthenticated, HasItem2Permission]

    def get(self, request):
        item = get_object_or_404(Item, pk=settings.ITEM2_ID)
        # Convert logic here, using the 'item' instance
        return Response({"message": f"Convert from {item.name}"})

class Item3DashboardView(APIView):
    permission_classes = [IsAuthenticated, HasItem3Permission]

    def get(self, request):
        item = get_object_or_404(Item, pk=settings.ITEM3_ID)
        # Dashboard logic here, using the 'item' instance
        return Response({"message": f"Dashboard from {item.name}"})