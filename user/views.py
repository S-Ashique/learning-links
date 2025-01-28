from django.shortcuts import render
from django.http import JsonResponse
from student.models import Student, StudentClass, StudentClassReport

# Create your views here.


def NewReport(request, id):
    if request.method == 'POST':
        student = Student.objects.filter(id=id).first()
        if not student:
            return JsonResponse({'message': 'Student not found'}, status=404)
        
        latest_class = StudentClass.objects.filter(
            student=student).first()
        
        numeracylevel = request.POST.get('numeracylevel')
        literacylevel = request.POST.get('literacylevel')
        description = request.POST.get('description')

        report = StudentClassReport(
            student=student,
            student_class=latest_class,
            numeracylevel=numeracylevel,
            literacylevel=literacylevel,
            description=description,
            updated_by=request.user
        )
        report.save()
        data={
            'class': report.student_class.class_name,
            'numeracylevel': report.numeracylevel,
            'literacylevel': report.literacylevel,
            'description': report.description,
            'updated_by': report.updated_by.username,
            'created_at': report.created_at.strftime('%b. %d, %Y')
        }
        return JsonResponse(data, status=200)

