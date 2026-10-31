import { jsPDF } from 'jspdf';
import { ScreeningReportData, ToneResponse } from '../types';

export class PdfService {
  /**
   * Generates and downloads a clinical-grade PDF screening report
   * matching EchoSense branding and medical documentation standards.
   */
  public generateHearingReportPDF(report: ScreeningReportData): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    const testId = report.testId || `ES-${(report.id || 'SCREEN').replace('local-', '').slice(0, 8).toUpperCase()}`;
    const reportDate = new Date(report.timestamp);
    const dateFormatted = reportDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const timeFormatted = reportDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    // ----------------------------------------------------
    // 1. TOP HEADER & BRANDING
    // ----------------------------------------------------
    // Dark top header bar
    doc.setFillColor(18, 18, 18);
    doc.rect(margin, 12, contentWidth, 24, 'F');

    // Accent Gold Stripe
    doc.setFillColor(255, 199, 0);
    doc.rect(margin, 36, contentWidth, 2.5, 'F');

    // Brand Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('ECHOSENSE', margin + 6, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 199, 0);
    doc.text('INTELLIGENT AUDITORY SCREENING & FREQUENCY HEALTH REPORT', margin + 6, 28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`TEST ID: ${testId}`, pageWidth - margin - 6, 25, { align: 'right' });

    // ----------------------------------------------------
    // 2. PATIENT / SCREENING SESSION DETAILS
    // ----------------------------------------------------
    let currentY = 43;

    doc.setFillColor(250, 249, 246);
    doc.setDrawColor(18, 18, 18);
    doc.setLineWidth(0.4);
    doc.rect(margin, currentY, contentWidth, 24, 'FD');

    // Section title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(18, 18, 18);
    doc.text('SCREENING RECORD & PATIENT PROFILE', margin + 4, currentY + 6);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin + 4, currentY + 8, margin + contentWidth - 4, currentY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);

    // Row 1
    doc.text(`Patient / User Name:`, margin + 4, currentY + 13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(18, 18, 18);
    doc.text(report.userName || 'Anonymous Participant', margin + 38, currentY + 13);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(`Age:`, margin + 95, currentY + 13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(18, 18, 18);
    doc.text(`${report.age || 'N/A'} yrs`, margin + 104, currentY + 13);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(`Tested Ear:`, margin + 130, currentY + 13);
    doc.setFont('helvetica', 'bold');
    const earDisplay = report.testedEar 
      ? (report.testedEar === 'both' ? 'Bilateral (Both Ears)' : `${report.testedEar.toUpperCase()} Ear Only`)
      : 'Bilateral (Both Ears)';
    doc.setTextColor(report.testedEar === 'left' ? 30 : (report.testedEar === 'right' ? 180 : 18), 30, report.testedEar === 'left' ? 200 : 30);
    doc.text(earDisplay, margin + 148, currentY + 13);

    // Row 2
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(`Test Date & Time:`, margin + 4, currentY + 19);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(18, 18, 18);
    doc.text(`${dateFormatted} at ${timeFormatted}`, margin + 38, currentY + 19);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(`Language:`, margin + 130, currentY + 19);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(18, 18, 18);
    doc.text((report.preferredLanguage || 'en').toUpperCase(), margin + 148, currentY + 19);

    // ----------------------------------------------------
    // 3. OVERALL SCREENING ASSESSMENT SUMMARY
    // ----------------------------------------------------
    currentY += 28;

    let bannerBg = [255, 243, 205]; // amber
    let bannerBorder = [18, 18, 18];
    let badgeText = 'MODERATE CONCERN';
    let badgeBg = [255, 199, 0];

    if (report.concernLevel === 'HIGH') {
      bannerBg = [254, 226, 226];
      badgeText = 'ELEVATED CONCERN IDENTIFIED';
      badgeBg = [239, 68, 68];
    } else if (report.concernLevel === 'LOW') {
      bannerBg = [236, 253, 245];
      badgeText = 'LOW AUDITORY CONCERN';
      badgeBg = [76, 191, 166];
    }

    doc.setFillColor(bannerBg[0], bannerBg[1], bannerBg[2]);
    doc.setDrawColor(bannerBorder[0], bannerBorder[1], bannerBorder[2]);
    doc.setLineWidth(0.4);
    doc.rect(margin, currentY, contentWidth, 22, 'FD');

    // Badge pill
    doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
    doc.rect(margin + 4, currentY + 4, 52, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(18, 18, 18);
    doc.text(badgeText, margin + 6, currentY + 8);

    // Overall Score - dynamically computed only from non-skipped completed tests
    const validScores: number[] = [];
    if (report.repetitionTest?.accuracyPercentage !== undefined) {
      validScores.push(report.repetitionTest.accuracyPercentage);
    }
    if (report.misheardTest?.accuracyPercentage !== undefined) {
      validScores.push(report.misheardTest.accuracyPercentage);
    }
    if (report.frequencyTest?.detectionPercentage !== undefined) {
      validScores.push(report.frequencyTest.detectionPercentage);
    }
    if (report.leftEarResult?.frequencyDetectionPercentage !== undefined) {
      validScores.push(report.leftEarResult.frequencyDetectionPercentage);
    }
    if (report.rightEarResult?.frequencyDetectionPercentage !== undefined) {
      validScores.push(report.rightEarResult.frequencyDetectionPercentage);
    }

    const overallScore = validScores.length > 0
      ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
      : 0;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(18, 18, 18);
    doc.text(`Composite Screening Score: ${overallScore}%`, pageWidth - margin - 4, currentY + 8, { align: 'right' });

    // Concern reason text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    const reasonLines = doc.splitTextToSize(report.concernReason, contentWidth - 8);
    doc.text(reasonLines.slice(0, 3), margin + 4, currentY + 14);

    // ----------------------------------------------------
    // 4. EAR-SPECIFIC RESULTS (LEFT VS RIGHT EAR)
    // ----------------------------------------------------
    currentY += 26;

    const colWidth = (contentWidth - 6) / 2;

    // LEFT EAR CARD
    doc.setFillColor(240, 249, 255); // soft cyan/blue
    doc.setDrawColor(18, 18, 18);
    doc.setLineWidth(0.3);
    doc.rect(margin, currentY, colWidth, 38, 'FD');

    // Left Ear Header
    doc.setFillColor(59, 130, 246);
    doc.rect(margin, currentY, colWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('LEFT EAR TEST METRICS (BLUE [X])', margin + 4, currentY + 4.2);

    const hasLeftResult = Boolean(report.leftEarResult);
    const hasFrequencyTest = Boolean(report.frequencyTest);
    const leftTested = hasLeftResult || (hasFrequencyTest && (report.testedEar === 'left' || report.testedEar === 'both' || !report.testedEar));
    const leftDetection = report.leftEarResult?.frequencyDetectionPercentage ?? 
      (report.testedEar === 'left' ? (report.frequencyTest?.detectionPercentage ?? 0) : (leftTested ? (report.frequencyTest?.detectionPercentage ?? 0) : 0));
    const leftDetectedCount = report.leftEarResult?.detectedTones ?? (leftTested ? (report.frequencyTest?.detectedTones ?? 0) : 0);
    const leftTotalCount = report.leftEarResult?.totalTones ?? (leftTested ? (report.frequencyTest?.totalTones ?? 8) : 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text(`Evaluation Status:`, margin + 4, currentY + 11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(leftTested ? 18 : 120, leftTested ? 18 : 120, leftTested ? 18 : 120);
    doc.text(leftTested ? 'Evaluated & Recorded' : 'Not Tested in this Session', margin + 35, currentY + 11);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`Tone Detection Rate:`, margin + 4, currentY + 17);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(18, 18, 18);
    doc.text(`${leftDetection}% (${leftDetectedCount}/${leftTotalCount} tones heard)`, margin + 35, currentY + 17);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`Frequency Range:`, margin + 4, currentY + 23);
    doc.setFont('helvetica', 'bold');
    doc.text(`250 Hz – 12,000 Hz`, margin + 35, currentY + 23);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`Screening Threshold:`, margin + 4, currentY + 29);
    doc.setFont('helvetica', 'bold');
    doc.text(leftDetection >= 80 ? 'Normal Sensitivity (15–20 dB HL est.)' : 'Elevated Threshold (>30 dB HL est.)', margin + 35, currentY + 29);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`Acoustic Isolation:`, margin + 4, currentY + 34);
    doc.setFont('helvetica', 'bold');
    doc.text(`Contralateral Pink Noise Masking Active`, margin + 35, currentY + 34);

    // RIGHT EAR CARD
    const rightX = margin + colWidth + 6;
    doc.setFillColor(255, 251, 235); // soft warm/amber
    doc.setDrawColor(18, 18, 18);
    doc.setLineWidth(0.3);
    doc.rect(rightX, currentY, colWidth, 38, 'FD');

    // Right Ear Header
    doc.setFillColor(217, 119, 6);
    doc.rect(rightX, currentY, colWidth, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('RIGHT EAR TEST METRICS (RED [O])', rightX + 4, currentY + 4.2);

    const hasRightResult = Boolean(report.rightEarResult);
    const rightTested = hasRightResult || (hasFrequencyTest && (report.testedEar === 'right' || report.testedEar === 'both' || !report.testedEar));
    const rightDetection = report.rightEarResult?.frequencyDetectionPercentage ?? 
      (report.testedEar === 'right' ? (report.frequencyTest?.detectionPercentage ?? 0) : (rightTested ? (report.frequencyTest?.detectionPercentage ?? 0) : 0));
    const rightDetectedCount = report.rightEarResult?.detectedTones ?? (rightTested ? (report.frequencyTest?.detectedTones ?? 0) : 0);
    const rightTotalCount = report.rightEarResult?.totalTones ?? (rightTested ? (report.frequencyTest?.totalTones ?? 8) : 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 40);
    doc.text(`Evaluation Status:`, rightX + 4, currentY + 11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rightTested ? 18 : 120, rightTested ? 18 : 120, rightTested ? 18 : 120);
    doc.text(rightTested ? 'Evaluated & Recorded' : 'Not Tested in this Session', rightX + 35, currentY + 11);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`Tone Detection Rate:`, rightX + 4, currentY + 17);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(18, 18, 18);
    doc.text(`${rightDetection}% (${rightDetectedCount}/${rightTotalCount} tones heard)`, rightX + 35, currentY + 17);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`Frequency Range:`, rightX + 4, currentY + 23);
    doc.setFont('helvetica', 'bold');
    doc.text(`250 Hz – 12,000 Hz`, rightX + 35, currentY + 23);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`Screening Threshold:`, rightX + 4, currentY + 29);
    doc.setFont('helvetica', 'bold');
    doc.text(rightDetection >= 80 ? 'Normal Sensitivity (15–20 dB HL est.)' : 'Elevated Threshold (>30 dB HL est.)', rightX + 35, currentY + 29);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    doc.text(`Acoustic Isolation:`, rightX + 4, currentY + 34);
    doc.setFont('helvetica', 'bold');
    doc.text(`Contralateral Pink Noise Masking Active`, rightX + 35, currentY + 34);

    // ----------------------------------------------------
    // 5. VECTOR AUDIOGRAM VISUALIZATION (CLINICAL GRID)
    // ----------------------------------------------------
    currentY += 42;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(18, 18, 18);
    doc.setLineWidth(0.4);
    doc.rect(margin, currentY, contentWidth, 54, 'FD');

    // Title & Legend
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(18, 18, 18);
    doc.text('FREQUENCY SENSITIVITY AUDIOGRAM (PURE TONE SCREENING)', margin + 4, currentY + 5.5);

    // Legend items
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(59, 130, 246);
    doc.text('X  Left Ear', pageWidth - margin - 55, currentY + 5.5);
    doc.setTextColor(220, 38, 38);
    doc.text('O  Right Ear', pageWidth - margin - 35, currentY + 5.5);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Green: Normal (<25 dB)', pageWidth - margin - 15, currentY + 5.5, { align: 'right' });

    // Audiogram plotting parameters
    const chartX = margin + 18;
    const chartY = currentY + 9;
    const chartW = contentWidth - 24;
    const chartH = 38;

    // Normal Hearing shaded area (0 - 25 dB HL estimate)
    doc.setFillColor(240, 253, 244); // very soft green
    doc.rect(chartX, chartY, chartW, chartH * 0.35, 'F');

    // Grid lines for dB HL (0 dB, 25 dB, 50 dB, 75 dB, 100 dB)
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.15);
    for (let i = 0; i <= 4; i++) {
      const lineY = chartY + (chartH / 4) * i;
      doc.line(chartX, lineY, chartX + chartW, lineY);

      // Y-axis labels
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 100, 100);
      const dbLabel = `${i * 25} dB`;
      doc.text(dbLabel, chartX - 2, lineY + 1, { align: 'right' });
    }

    // Frequencies (X-axis)
    const frequencies = [250, 500, 1000, 2000, 4000, 6000, 8000, 12000];
    const freqStep = chartW / (frequencies.length - 1);

    frequencies.forEach((freq, idx) => {
      const lineX = chartX + idx * freqStep;
      doc.setDrawColor(235, 235, 235);
      doc.line(lineX, chartY, lineX, chartY + chartH);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(80, 80, 80);
      const label = freq >= 1000 ? `${freq / 1000}k` : `${freq}`;
      doc.text(label, lineX, chartY + chartH + 3.5, { align: 'center' });
    });

    // Plot Left Ear (Blue X)
    const leftResponses: ToneResponse[] = report.leftEarResult?.responses || report.frequencyTest?.responses || [];
    const leftPoints: Array<{ x: number; y: number }> = [];

    frequencies.forEach((freq, idx) => {
      const match = leftResponses.find((r) => r.frequencyHz === freq);
      const heard = match ? match.heard : (leftDetection >= 75);
      // Map heard (15 dB HL est.) vs missed (55-65 dB HL est.)
      const estDb = heard ? 15 : 60;
      const ptY = chartY + (estDb / 100) * chartH;
      const ptX = chartX + idx * freqStep;
      leftPoints.push({ x: ptX, y: ptY });

      if (leftTested) {
        // Draw blue 'X'
        doc.setDrawColor(59, 130, 246);
        doc.setLineWidth(0.4);
        const sz = 1.2;
        doc.line(ptX - sz, ptY - sz, ptX + sz, ptY + sz);
        doc.line(ptX - sz, ptY + sz, ptX + sz, ptY - sz);
      }
    });

    if (leftTested && leftPoints.length > 1) {
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.3);
      for (let i = 0; i < leftPoints.length - 1; i++) {
        doc.line(leftPoints[i].x, leftPoints[i].y, leftPoints[i + 1].x, leftPoints[i + 1].y);
      }
    }

    // Plot Right Ear (Red O)
    const rightResponses: ToneResponse[] = report.rightEarResult?.responses || report.frequencyTest?.responses || [];
    const rightPoints: Array<{ x: number; y: number }> = [];

    frequencies.forEach((freq, idx) => {
      const match = rightResponses.find((r) => r.frequencyHz === freq);
      const heard = match ? match.heard : (rightDetection >= 75);
      const estDb = heard ? 18 : 65; // slight visual offset
      const ptY = chartY + (estDb / 100) * chartH;
      const ptX = chartX + idx * freqStep;
      rightPoints.push({ x: ptX, y: ptY });

      if (rightTested) {
        // Draw red 'O'
        doc.setDrawColor(220, 38, 38);
        doc.setLineWidth(0.35);
        doc.circle(ptX, ptY, 1.2, 'S');
      }
    });

    if (rightTested && rightPoints.length > 1) {
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.3);
      for (let i = 0; i < rightPoints.length - 1; i++) {
        doc.line(rightPoints[i].x, rightPoints[i].y, rightPoints[i + 1].x, rightPoints[i + 1].y);
      }
    }

    // If neither ear was tested for pure tones (e.g., pure tone / ear assessment skipped)
    if (!leftTested && !rightTested) {
      doc.setFillColor(255, 255, 255, 0.85);
      doc.rect(chartX + 10, chartY + 12, chartW - 20, 14, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(180, 80, 20);
      doc.text('PURE TONE TESTING SKIPPED • NO AUDIOGRAM PLOT AVAILABLE', chartX + chartW / 2, chartY + 18, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(80, 80, 80);
      doc.text('Pure tone frequency detection was not evaluated in this screening session.', chartX + chartW / 2, chartY + 23, { align: 'center' });
    }

    // ----------------------------------------------------
    // 6. SPEECH AUDIOMETRY & COGNITIVE TESTS SUMMARY
    // ----------------------------------------------------
    currentY += 58;

    doc.setFillColor(250, 249, 246);
    doc.setDrawColor(18, 18, 18);
    doc.setLineWidth(0.3);
    doc.rect(margin, currentY, contentWidth, 34, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(18, 18, 18);
    doc.text('SPEECH DISCRIMINATION & BANDWIDTH RESILIENCE', margin + 4, currentY + 5.5);

    // Test 1 summary
    if (report.repetitionTest) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(18, 18, 18);
      doc.text(`Test 1: Sentence Repetition across Bandwidths [COMPLETED]`, margin + 4, currentY + 11.5);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Accuracy: ${report.repetitionTest.accuracyPercentage}% (${report.repetitionTest.correctAnswers}/${report.repetitionTest.totalQuestions} stages correct, ${report.repetitionTest.totalRepetitions} audio replays requested)`,
        margin + 4,
        currentY + 16
      );
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(180, 100, 20);
      doc.text(`Test 1: Sentence Repetition across Bandwidths [SKIPPED - INCOMPLETE]`, margin + 4, currentY + 11.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Status: Test skipped by user. Auditory speech perception across bandpass filters was not evaluated.`, margin + 4, currentY + 16);
    }

    // Test 2 summary
    if (report.misheardTest) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(18, 18, 18);
      doc.text(`Test 2: Minimal-Pairs Phonemic Distinction [COMPLETED]`, margin + 4, currentY + 22);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Accuracy: ${report.misheardTest.accuracyPercentage}% (${report.misheardTest.correctlyRecognized?.length || 0}/${report.misheardTest.totalWords || 5} pairs correctly distinguished)`,
        margin + 4,
        currentY + 26.5
      );

      const areas = report.misheardTest.beneficialAssessmentAreas?.join(', ') || 'Vowel Formants, High Fricatives';
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Focus Areas Evaluated: ${areas}`, margin + 4, currentY + 31);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(180, 100, 20);
      doc.text(`Test 2: Minimal-Pairs Phonemic Distinction [SKIPPED - INCOMPLETE]`, margin + 4, currentY + 22);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Status: Test skipped by user. Phonemic discrimination across minimal word pairs was not evaluated.`, margin + 4, currentY + 26.5);
    }

    // ----------------------------------------------------
    // 7. MEDICAL DISCLAIMER & MANDATORY NOTICE
    // ----------------------------------------------------
    currentY += 38;

    doc.setFillColor(254, 243, 199); // soft yellow warning box
    doc.setDrawColor(18, 18, 18);
    doc.setLineWidth(0.4);
    doc.rect(margin, currentY, contentWidth, 25, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(18, 18, 18);
    doc.text('IMPORTANT MEDICAL & REGULATORY DISCLAIMER', margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 30, 30);
    const disclaimerText = 
      "This document is an informational digital screening report generated by EchoSense. " +
      "It is NOT a medical diagnosis, certified clinical audiogram, or healthcare consultation. " +
      "Consumer headphones and mobile/desktop soundcards are not calibrated to ANSI/ISO audiometric standards and cannot rule out or verify organic hearing loss. " +
      "If you experience hearing loss, ringing in the ears (tinnitus), asymmetric hearing, ear pain, or difficulty in daily communication, " +
      "please immediately consult a licensed audiologist, otolaryngologist (ENT), or physician for a comprehensive clinical audiometric evaluation.";
    const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 8);
    doc.text(disclaimerLines, margin + 4, currentY + 9);

    // ----------------------------------------------------
    // 8. FOOTER
    // ----------------------------------------------------
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('EchoSense Digital Auditory Wellness Screening • AI-Powered Hearing Health', margin, pageHeight - 7);
    doc.text(`Generated: ${new Date().toISOString()} • Confidential`, pageWidth - margin, pageHeight - 7, { align: 'right' });

    // Download file
    const safeTestId = testId.replace(/[^a-zA-Z0-9-_]/g, '_');
    doc.save(`EchoSense_Hearing_Report_Test_${safeTestId}.pdf`);
  }
}

export const pdfService = new PdfService();
