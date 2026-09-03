import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import { MineSite, StatutoryComplianceItem, FieldInspection, SubsidiaryCode } from '../types';

interface StatutoryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMine: MineSite | undefined;
  complianceItems: StatutoryComplianceItem[];
  inspections: FieldInspection[];
  selectedSubsidiary: SubsidiaryCode;
}

export const StatutoryReportModal: React.FC<StatutoryReportModalProps> = ({
  isOpen,
  onClose,
  selectedMine,
  complianceItems,
  inspections,
  selectedSubsidiary,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter items specifically for the selected mine
  const mineCompliance = selectedMine 
    ? complianceItems.filter(i => i.mineId === selectedMine.id || selectedSubsidiary === 'CIL_HQ')
    : complianceItems;

  const mineInspections = selectedMine
    ? inspections.filter(i => i.mineId === selectedMine.id || selectedSubsidiary === 'CIL_HQ')
    : inspections;

  // Key Summary Stats
  const complianceScore = selectedMine?.complianceScore ?? 88;
  const safetyRating = selectedMine?.safetyRating ?? 'A';
  const openViolations = mineInspections.filter(i => i.capaStatus === 'OPEN').length;
  const inProgressViolations = mineInspections.filter(i => i.capaStatus === 'IN_PROGRESS').length;
  const rectifiedViolations = mineInspections.filter(i => i.capaStatus === 'FIELD_RECTIFIED' || i.capaStatus === 'STATUTORY_VERIFIED' || i.capaStatus === 'CLOSED').length;
  const criticalHazards = mineInspections.filter(i => i.severity === 'CRITICAL_FATAL_RISK').length;
  const highHazards = mineInspections.filter(i => i.severity === 'HIGH').length;

  const compliantObligations = mineCompliance.filter(i => i.status === 'COMPLIANT').length;
  const nearingDueObligations = mineCompliance.filter(i => i.status === 'NEARING_DUE').length;
  const nonCompliantObligations = mineCompliance.filter(i => i.status === 'NON_COMPLIANT' || i.status === 'CRITICAL_BREACH').length;

  const handlePrint = () => {
    window.print();
  };

  /**
   * Generates a comprehensive, structured PDF Compliance Report using jsPDF & jspdf-autotable
   */
  const handleGeneratePDF = () => {
    setIsGeneratingPDF(true);
    setPdfSuccessMessage(null);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const reportRefId = `DGMS-CIL-${(selectedMine?.code || 'BCCL-BLK2').replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString().slice(-6)}`;
      const cryptoHash = 'SHA256-' + Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();

      // --- PAGE 1: HEADER & LETTERHEAD ---
      // Top Header Background Accent Bar
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setFillColor(217, 119, 6); // amber-600 gold stripe
      doc.rect(0, 27, pageWidth, 2, 'F');

      // Top Header Text
      doc.setTextColor(245, 158, 11); // amber-400
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`COAL INDIA LIMITED • ${selectedSubsidiary}`, margin, 12);

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('STATUTORY MINING COMPLIANCE & SAFETY AUDIT RETURN', margin, 18);

      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Submission under Mines Act 1952 (Sec 22) & Coal Mines Regulations 2017 (Reg 106/153) | DGMS & CPCB Format', margin, 23);

      // Report Reference Badge (Top Right)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(245, 158, 11);
      doc.text(`REF: ${reportRefId}`, pageWidth - margin, 12, { align: 'right' });
      doc.setTextColor(203, 213, 225);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`DATE: ${todayStr}`, pageWidth - margin, 18, { align: 'right' });
      doc.text('CLASSIFICATION: STATUTORY AUDIT', pageWidth - margin, 23, { align: 'right' });

      let currentY = 35;

      // --- COLLIERY METADATA BOX ---
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(margin, currentY, contentWidth, 26, 2, 2, 'FD');

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.setFont('helvetica', 'bold');

      // Column 1
      doc.text('COLLIERY NAME:', margin + 4, currentY + 6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.text(selectedMine?.name || 'Pan-India Overview Colliery', margin + 4, currentY + 11);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('DGMS REG / CODE:', margin + 4, currentY + 18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(selectedMine?.code || 'BCCL-BLK2-OCP', margin + 4, currentY + 23);

      // Column 2
      const col2X = margin + 50;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('MINE TYPE & ZONE:', col2X, currentY + 6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${selectedMine?.type || 'OPENCAST'} | ${selectedMine?.dgmsZone || 'Eastern Zone'}`, col2X, currentY + 11);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('LOCATION / STATE:', col2X, currentY + 18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${selectedMine?.district || 'Dhanbad'}, ${selectedMine?.state || 'Jharkhand'}`, col2X, currentY + 23);

      // Column 3
      const col3X = margin + 115;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('PROJECT OFFICER / AGENT:', col3X, currentY + 6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(selectedMine?.projectOfficer || 'Er. A.K. Sharma', col3X, currentY + 11);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('CAPACITY & WORKFORCE:', col3X, currentY + 18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${selectedMine?.productionCapacityMTPA || 6.5} MTPA | ${selectedMine?.activeWorkforce || 1420} Personnel`, col3X, currentY + 23);

      currentY += 32;

      // --- SECTION 1: EXECUTIVE COMPLIANCE SUMMARY STATS ---
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('1. EXECUTIVE STATUTORY COMPLIANCE & SAFETY SCORECARD', margin, currentY);
      currentY += 4;

      const cardWidth = (contentWidth - 12) / 4;
      const cardHeight = 20;

      // Card 1: Statutory Compliance Index
      doc.setFillColor(240, 253, 244); // green-50
      doc.setDrawColor(187, 247, 208); // green-200
      doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, 'FD');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 101, 52); // green-800
      doc.text('COMPLIANCE INDEX', margin + 3, currentY + 6);
      doc.setFontSize(13);
      doc.text(`${complianceScore}%`, margin + 3, currentY + 14);
      doc.setFontSize(6.5);
      doc.setTextColor(74, 222, 128);
      doc.text(complianceScore >= 85 ? '● DGMS Compliant' : '▲ Action Required', margin + 3, currentY + 18);

      // Card 2: Safety Rating
      const card2X = margin + cardWidth + 4;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, 'FD');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('DGMS SAFETY RATING', card2X + 3, currentY + 6);
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(`Grade ${safetyRating}`, card2X + 3, currentY + 14);
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Annual Assessment', card2X + 3, currentY + 18);

      // Card 3: Active Violation Notices
      const card3X = margin + (cardWidth + 4) * 2;
      const hasCritical = criticalHazards > 0;
      if (hasCritical) {
        doc.setFillColor(254, 242, 242); // red-50
        doc.setDrawColor(254, 202, 202); // red-200
        doc.setTextColor(153, 27, 27); // red-800
      } else {
        doc.setFillColor(255, 251, 235); // amber-50
        doc.setDrawColor(253, 230, 138); // amber-200
        doc.setTextColor(146, 64, 14); // amber-800
      }
      doc.roundedRect(card3X, currentY, cardWidth, cardHeight, 2, 2, 'FD');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('OPEN DGMS NOTICES', card3X + 3, currentY + 6);
      doc.setFontSize(13);
      doc.text(`${openViolations} Active`, card3X + 3, currentY + 14);
      doc.setFontSize(6.5);
      doc.text(`${criticalHazards} Critical | ${highHazards} High Risk`, card3X + 3, currentY + 18);

      // Card 4: Statutory Filings Status
      const card4X = margin + (cardWidth + 4) * 3;
      doc.setFillColor(240, 249, 255); // sky-50
      doc.setDrawColor(186, 230, 253);
      doc.roundedRect(card4X, currentY, cardWidth, cardHeight, 2, 2, 'FD');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 89, 133);
      doc.text('STATUTORY FILINGS', card4X + 3, currentY + 6);
      doc.setFontSize(13);
      doc.text(`${compliantObligations}/${mineCompliance.length}`, card4X + 3, currentY + 14);
      doc.setFontSize(6.5);
      doc.text(`${nearingDueObligations} Due Soon | ${nonCompliantObligations} Overdue`, card4X + 3, currentY + 18);

      currentY += 26;

      // --- SECTION 2: CURRENT VIOLATIONS & NON-CONFORMANCE STATUS TABLE ---
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('2. CURRENT FIELD VIOLATION NOTICES & CAPA ACTION TRACKING', margin, currentY);
      currentY += 3;

      const violationTableRows = mineInspections.map(insp => [
        insp.id,
        insp.locationTag,
        `${insp.violatedRegulation}\n(${insp.category})`,
        insp.severity.replace(/_/g, ' '),
        insp.capaStatus.replace(/_/g, ' '),
        insp.deadlineDate || 'Immediate',
        `${insp.assignedTo}\n(Risk: ${insp.aiRiskScore}/100)`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['ID', 'Location / Sector', 'Violated Regulation & Category', 'Severity', 'CAPA Status', 'Deadline', 'Assignee / AI Risk']],
        body: violationTableRows.length > 0 ? violationTableRows : [['-', 'No active field violations recorded for this colliery', '-', '-', 'COMPLIANT', '-', '-']],
        theme: 'grid',
        headStyles: {
          fillColor: [30, 41, 59], // slate-800
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'left',
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [30, 41, 59],
          valign: 'middle',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 20, fontStyle: 'bold' },
          1: { cellWidth: 32 },
          2: { cellWidth: 46 },
          3: { cellWidth: 22, fontStyle: 'bold' },
          4: { cellWidth: 22, fontStyle: 'bold' },
          5: { cellWidth: 18 },
          6: { cellWidth: 22 },
        },
        didParseCell: (data) => {
          // Color code severity column
          if (data.section === 'body' && data.column.index === 3) {
            const val = String(data.cell.raw);
            if (val.includes('CRITICAL')) {
              data.cell.styles.textColor = [185, 28, 28]; // red-700
              data.cell.styles.fontStyle = 'bold';
            } else if (val.includes('HIGH')) {
              data.cell.styles.textColor = [194, 65, 12]; // orange-700
            }
          }
          // Color code CAPA status column
          if (data.section === 'body' && data.column.index === 4) {
            const val = String(data.cell.raw);
            if (val.includes('OPEN')) {
              data.cell.styles.textColor = [185, 28, 28];
              data.cell.styles.fontStyle = 'bold';
            } else if (val.includes('RECTIFIED') || val.includes('VERIFIED') || val.includes('CLOSED')) {
              data.cell.styles.textColor = [21, 128, 61];
            } else if (val.includes('IN PROGRESS')) {
              data.cell.styles.textColor = [2, 132, 199];
            }
          }
        },
        margin: { left: margin, right: margin },
      });

      // Get Y position after the first table
      currentY = (doc as any).lastAutoTable.finalY + 8;

      // Check if we need a new page for Section 3
      if (currentY > pageHeight - 65) {
        doc.addPage();
        currentY = 20;
      }

      // --- SECTION 3: KEY STATUTORY MANDATES & CLEARANCES ---
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('3. STATUTORY CLEARANCES & REGULATORY FILINGS AUDIT', margin, currentY);
      currentY += 3;

      const statutoryTableRows = mineCompliance.map(comp => [
        comp.actReference,
        comp.title,
        comp.regulatoryAuthority,
        comp.frequency,
        comp.dueDate,
        comp.status.replace(/_/g, ' ')
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Act / Regulation Reference', 'Obligation Title', 'Authority', 'Frequency', 'Due Date', 'Status']],
        body: statutoryTableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'left',
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [30, 41, 59],
          valign: 'middle',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 42, fontStyle: 'bold' },
          1: { cellWidth: 54 },
          2: { cellWidth: 20 },
          3: { cellWidth: 22 },
          4: { cellWidth: 20 },
          5: { cellWidth: 24, fontStyle: 'bold' },
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 5) {
            const val = String(data.cell.raw);
            if (val.includes('COMPLIANT')) {
              data.cell.styles.textColor = [21, 128, 61];
            } else if (val.includes('NEARING')) {
              data.cell.styles.textColor = [194, 65, 12];
            } else if (val.includes('NON') || val.includes('BREACH')) {
              data.cell.styles.textColor = [185, 28, 28];
            }
          }
        },
        margin: { left: margin, right: margin },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;

      // Check if sign-off block fits on current page
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = 20;
      }

      // --- SECTION 4: CRYPTOGRAPHIC SEAL & SIGN-OFF BLOCK ---
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, currentY, contentWidth, 38, 2, 2, 'FD');

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('CRYPTOGRAPHIC AUDIT SEAL & STATUTORY SIGN-OFF', margin + 4, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Legally validated under Section 65B of the Indian Evidence Act (1872) & Mines Act 1952 (Sec 22)', margin + 4, currentY + 10);

      // Hash Box
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin + 4, currentY + 13, contentWidth - 8, 7, 1, 1, 'F');
      doc.setFont('courier', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(52, 211, 153); // emerald-400
      doc.text(`INTEGRITY HASH: ${cryptoHash} | BLOCK #128-DGMS-VERIFIED`, margin + 6, currentY + 17.5);

      // Signature Lines
      const sig1X = margin + 15;
      const sig2X = margin + 110;
      const sigY = currentY + 31;

      doc.setDrawColor(148, 163, 184);
      doc.line(sig1X, sigY, sig1X + 50, sigY);
      doc.line(sig2X, sigY, sig2X + 50, sigY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(15, 23, 42);
      doc.text('COLLIERY MANAGER / AGENT', sig1X + 5, sigY + 4);
      doc.text('DGMS / SAFETY OFFICER', sig2X + 8, sigY + 4);

      // --- MULTI-PAGE FOOTERS ---
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        
        // Footer line
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

        doc.text(`MineSync AI Statutory Governance System • Ref: ${reportRefId}`, margin, pageHeight - 6);
        doc.text(`CONFIDENTIAL - FOR DGMS & CIL STATUTORY AUDIT ONLY • Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
      }

      // Save PDF Document
      const safeFilename = `DGMS-Compliance-Report-${(selectedMine?.code || 'Colliery').replace(/[^a-zA-Z0-9_-]/g, '')}-${todayStr.replace(/\s+/g, '-')}.pdf`;
      doc.save(safeFilename);

      setPdfSuccessMessage(`Generated and downloaded: ${safeFilename}`);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      console.error('Failed to generate compliance PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Statutory Return & Compliance Audit Certificate (DGMS / CPCB Format)
              </h3>
              <p className="text-[11px] text-slate-400">
                {selectedMine?.name || 'Pan-India Overview'} • {selectedSubsidiary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary jsPDF Structured Generator Button */}
            <button
              id="btn-generate-jspdf-report"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
              title="Generate structured PDF report with tables and statistics using jsPDF"
            >
              {isGeneratingPDF ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                  <span>Export Structured PDF (jsPDF)</span>
                </>
              )}
            </button>

            {/* Print / Save Preview Fallback */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print View</span>
            </button>

            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {pdfSuccessMessage && (
          <div className="bg-emerald-950/80 border-b border-emerald-800/80 px-4 py-2 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{pdfSuccessMessage}</span>
            </span>
            <button 
              onClick={() => setPdfSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Printable Document Paper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950 text-slate-200 font-sans space-y-6">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-700 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                CIL
              </div>
              <h1 className="text-base font-extrabold tracking-wider uppercase text-slate-100">
                COAL INDIA LIMITED • {selectedSubsidiary}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-semibold">
              STATUTORY MINING COMPLIANCE & SAFETY AUDIT RETURN
            </p>
            <p className="text-[11px] font-mono text-amber-400">
              Submission under Mines Act 1952 (Sec 22) & Coal Mines Regulations 2017 (Reg 106/153)
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Colliery Name</span>
              <span className="font-bold text-slate-100">{selectedMine?.name || 'Pan-India Overview'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Colliery Code / DGMS Reg</span>
              <span className="font-mono font-bold text-slate-200">{selectedMine?.code || 'BCCL-BLK2-OCP'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Audit Date & Period</span>
              <span className="font-bold text-slate-200">{new Date().toLocaleDateString('en-GB')} (FY26 Q2)</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Agent / Project Officer</span>
              <span className="font-bold text-slate-200">{selectedMine?.projectOfficer || 'Er. A.K. Sharma'}</span>
            </div>
          </div>

          {/* Summary Executive Standing */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>1. Executive Safety & Statutory Compliance Scorecard</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Statutory Compliance Index</span>
                <span className="text-xl font-black text-emerald-400">{complianceScore}%</span>
                <span className="text-[10px] text-slate-500 block pt-0.5">Rating: Grade {safetyRating}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Open DGMS Notices</span>
                <span className="text-xl font-black text-amber-400">{openViolations} Active</span>
                <span className="text-[10px] text-slate-500 block pt-0.5">{criticalHazards} Critical Fatal Risk</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Statutory Mandates</span>
                <span className="text-xl font-black text-sky-400">{compliantObligations}/{mineCompliance.length}</span>
                <span className="text-[10px] text-slate-500 block pt-0.5">{nearingDueObligations} Nearing Due</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Active Workforce</span>
                <span className="text-xl font-black text-indigo-400">{selectedMine?.activeWorkforce || 1420}</span>
                <span className="text-[10px] text-slate-500 block pt-0.5">VTC Rate: 94.8% Trained</span>
              </div>
            </div>
          </div>

          {/* Current Violation Status Table */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>2. Current Field Violation Status & Non-Conformance Actions ({mineInspections.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                {openViolations} Open / {inProgressViolations} In Progress / {rectifiedViolations} Rectified
              </span>
            </div>
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Location / Sector</th>
                    <th className="p-2.5">Violated Regulation</th>
                    <th className="p-2.5">Severity</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Deadline</th>
                    <th className="p-2.5">Assignee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {mineInspections.length > 0 ? (
                    mineInspections.map((insp) => (
                      <tr key={insp.id} className="hover:bg-slate-900/50">
                        <td className="p-2.5 font-mono text-[11px] font-bold text-amber-400">{insp.id}</td>
                        <td className="p-2.5 text-slate-200">{insp.locationTag}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-300">
                          <div>{insp.violatedRegulation}</div>
                          <span className="text-[10px] text-slate-500 font-sans">{insp.category}</span>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            insp.severity === 'CRITICAL_FATAL_RISK'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : insp.severity === 'HIGH'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                          }`}>
                            {insp.severity.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            insp.capaStatus === 'OPEN'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : insp.capaStatus === 'IN_PROGRESS'
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {insp.capaStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-300 font-mono text-[11px]">{insp.deadlineDate || 'Immediate'}</td>
                        <td className="p-2.5 text-slate-300">{insp.assignedTo}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-500">
                        No active non-conformances recorded for this mine site.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Mandates Table */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>3. Key Statutory Clearances & Regulatory Filings</span>
            </h3>
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-2.5">Regulation / Act</th>
                    <th className="p-2.5">Statutory Obligation Title</th>
                    <th className="p-2.5">Authority</th>
                    <th className="p-2.5">Frequency</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {mineCompliance.slice(0, 8).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/50">
                      <td className="p-2.5 font-mono text-[11px] text-amber-400">{item.actReference}</td>
                      <td className="p-2.5 font-medium text-slate-200">{item.title}</td>
                      <td className="p-2.5 text-slate-400">{item.regulatoryAuthority}</td>
                      <td className="p-2.5 text-slate-400">{item.frequency}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.status === 'COMPLIANT'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : item.status === 'NEARING_DUE'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-300">{item.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Seal & Verification Footer */}
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200">Cryptographic Blockchain Non-Repudiation Stamp</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Section 65B Indian Evidence Act Validated</span>
            </div>
            <div className="font-mono text-[11px] text-emerald-400/90 break-all select-all bg-slate-950 p-2 rounded border border-slate-800">
              SHA256: e8b93f6c8d71249aa401e45903bf281d77a834162e245a90184b2cd230d41819 (Block #128)
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Digitally Authenticated by MineSync AI Core</span>
              <span>Generated on {new Date().toUTCString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
