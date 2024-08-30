import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ReportsPage() {
    const generatePDF = () => {
        try {
            const doc = new jsPDF();

            // Dummy data only
            const columns = ["ID", "Name", "Email"];
            const data = [
                [1, "John Doe", "john.doe@example.com"],
                [2, "Jane Smith", "jane.smith@example.com"],
                [3, "Sam Johnson", "sam.johnson@example.com"],
            ];

            doc.setFontSize(18);
            doc.text('My Custom PDF Report', 14, 22);

            doc.autoTable({
                head: [columns],
                body: data,
                theme: 'striped',
                headStyles: { fillColor: [0, 0, 256] },
                bodyStyles: { fontSize: 10 },
                styles: { cellPadding: 2 },
                margin: { top: 30 },
                didDrawPage: (data) => {
                    doc.setFontSize(10);
                    doc.text(`Page ${data.pageNumber} of ${data.pageCount}`, 200, 290, { align: 'right' });
                }
            });

            doc.save('custom-reports.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <div className='reports-page'>
            <h1 className='reports-title'>PDF Report</h1>
            <button onClick={generatePDF} className='generate-pdf-button'>
                Generate PDF
            </button>
        </div>
    );
}

export default ReportsPage;
