from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO
from django.core.files.base import ContentFile
from .models import PatientTest


def generate_pdf_report(report_instance):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    patient = report_instance.patient
    lab = report_instance.lab
    patient_tests = PatientTest.objects.filter(patient=patient, lab=lab)

    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, 800, f"{lab.name} Laboratory Report")

    c.setFont("Helvetica", 12)
    c.drawString(50, 770, f"Patient: {patient.full_name}")
    c.drawString(50, 755, f"Age: {patient.age} | Gender: {patient.gender}")
    c.drawString(50, 740, f"Email: {patient.email or 'N/A'}")
    c.drawString(50, 725, f"Phone: {patient.phone or 'N/A'}")

    y = 690
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Test Name")
    c.drawString(250, y, "Result")
    c.drawString(400, y, "Unit")
    c.drawString(500, y, "Status")

    y -= 20
    c.setFont("Helvetica", 11)
    for pt in patient_tests:
        if y < 100:
            c.showPage()
            y = 800
        c.drawString(50, y, pt.test.name)
        c.drawString(250, y, pt.result_value or "-")
        c.drawString(400, y, pt.result_unit or "-")
        c.drawString(500, y, pt.status)
        y -= 20

    c.showPage()
    c.save()
    pdf_data = buffer.getvalue()
    buffer.close()

    filename = f"report_{patient.full_name}_{report_instance.id}.pdf"
    report_instance.file.save(filename, ContentFile(pdf_data))
