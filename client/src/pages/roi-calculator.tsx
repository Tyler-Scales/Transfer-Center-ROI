import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Settings, Calculator, TrendingUp, BarChart3, Mail, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Calculation constants
const VARIABLE_COST_PER_TRANSFER = 200;
const NET_REVENUE_PER_ADMISSION = 10000;
const ANNUAL_OPERATIONAL_COST_SAVINGS = 2000000;
const LEAKAGE_RATE = 0.20;
const LEAKAGE_RECAPTURE_RATE = 0.25;
const NEW_INBOUND_VOLUME_GROWTH_RATE = 0.01;

interface CalculationResults {
  totalAnnualTransfers: number;
  totalAnnualInvestmentCost: number;
  recapturedLeakageRevenue: number;
  newGrowthRevenue: number;
  totalGrossFinancialBenefit: number;
  netAnnualFinancialBenefit: number;
  finalROI: number;
}

export default function ROICalculator() {
  const [staffedBeds, setStaffedBeds] = useState<string>("");
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [emailTo, setEmailTo] = useState<string>("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Fixed sender email address
  const fromEmail = "tyler.wallace@scalestreet.com";

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const emailMutation = useMutation({
    mutationFn: async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
      return apiRequest('POST', '/api/send-email', { to, from: fromEmail, subject, html });
    },
    onSuccess: () => {
      toast({
        title: "Email sent successfully!",
        description: "The ROI calculation has been sent to your email.",
      });
      setIsEmailDialogOpen(false);
      setEmailTo("");
    },
    onError: () => {
      toast({
        title: "Failed to send email",
        description: "Please check your email addresses and try again.",
        variant: "destructive",
      });
    },
  });

  const generateEmailHTML = (results: CalculationResults, beds: number): string => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: linear-gradient(135deg, #F97316, #0D9488); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .result-box { background: #F97316; color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .calculation { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .assumption { background: #e3f2fd; padding: 10px; margin: 5px 0; border-radius: 4px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Transfer Center ROI Analysis</h1>
            <p>Conduit Health Partners</p>
          </div>
          
          <div class="content">
            <h2>ROI Calculation Results</h2>
            <p><strong>Hospital Size:</strong> ${formatNumber(beds)} staffed beds</p>
            
            <div class="result-box">
              <h2>Final ROI: ${results.finalROI.toFixed(1)}:1</h2>
              <p>Net Annual Financial Benefit: ${formatCurrency(results.netAnnualFinancialBenefit)}</p>
            </div>
            
            <h3>Calculation Breakdown</h3>
            
            <div class="calculation">
              <h4>Annual Transfer Volume</h4>
              <p>Total Annual Transfers: ${formatNumber(results.totalAnnualTransfers)}</p>
              <p class="assumption"><em>Assumption: 12 transfers per staffed bed per year</em></p>
            </div>
            
            <div class="calculation">
              <h4>Investment Cost</h4>
              <p>Total Annual Investment Cost: ${formatCurrency(results.totalAnnualInvestmentCost)}</p>
              <p class="assumption"><em>Assumption: $150,000 annual investment</em></p>
            </div>
            
            <div class="calculation">
              <h4>Financial Benefits</h4>
              <p>Operational Cost Savings: ${formatCurrency(150000)}</p>
              <p>Recaptured Leakage Revenue: ${formatCurrency(results.recapturedLeakageRevenue)}</p>
              <p>New Growth Revenue: ${formatCurrency(results.newGrowthRevenue)}</p>
              <p><strong>Total Gross Financial Benefit: ${formatCurrency(results.totalGrossFinancialBenefit)}</strong></p>
            </div>
            
            <div class="footer">
              <p>This analysis is based on industry-standard assumptions for hospital transfer center operations.</p>
              <p>Generated by Conduit Health Partners ROI Calculator</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleSendEmail = () => {
    if (!results || !emailTo) return;
    
    const subject = `Transfer Center ROI Analysis - ${results.finalROI.toFixed(1)}:1 ROI`;
    const html = generateEmailHTML(results, parseInt(staffedBeds));
    
    emailMutation.mutate({ to: emailTo, subject, html });
  };



  const calculateROI = useCallback((beds: number): CalculationResults => {
    // Step 1: Total Annual Transfers
    const totalAnnualTransfers = beds * 12;

    // Step 2: Total Annual Investment Cost
    const totalAnnualInvestmentCost = totalAnnualTransfers * VARIABLE_COST_PER_TRANSFER;

    // Step 3: Revenue Calculations
    const recapturedLeakageRevenue = (totalAnnualTransfers * LEAKAGE_RATE) * LEAKAGE_RECAPTURE_RATE * NET_REVENUE_PER_ADMISSION;
    const newGrowthRevenue = totalAnnualTransfers * NEW_INBOUND_VOLUME_GROWTH_RATE * NET_REVENUE_PER_ADMISSION;
    const totalGrossFinancialBenefit = recapturedLeakageRevenue + newGrowthRevenue + ANNUAL_OPERATIONAL_COST_SAVINGS;

    // Step 4: Net Annual Financial Benefit
    const netAnnualFinancialBenefit = totalGrossFinancialBenefit - totalAnnualInvestmentCost;

    // Final ROI as ratio
    const finalROI = netAnnualFinancialBenefit / totalAnnualInvestmentCost;

    return {
      totalAnnualTransfers,
      totalAnnualInvestmentCost,
      recapturedLeakageRevenue,
      newGrowthRevenue,
      totalGrossFinancialBenefit,
      netAnnualFinancialBenefit,
      finalROI
    };
  }, []);

  const handleInputChange = (value: string) => {
    setStaffedBeds(value);
    
    const beds = parseInt(value);
    if (beds && beds > 0) {
      const calculationResults = calculateROI(beds);
      setResults(calculationResults);
    } else {
      setResults(null);
    }
  };

  const assumptions = [
    { label: "Variable Cost per Transfer:", value: "$200" },
    { label: "Net Revenue per Admission:", value: "$10,000" },
    { label: "Annual Operational Cost Savings:", value: "$2,000,000" },
    { label: "Leakage Rate:", value: "20%" },
    { label: "Leakage Recapture Rate:", value: "25%" },
    { label: "New Inbound Volume Growth Rate:", value: "1%" }
  ];

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-8">
          <Building2 className="h-16 w-16 text-conduit-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Transfer Center</h1>
          <h2 className="text-xl font-semibold text-conduit-orange mb-2">ROI Calculator</h2>
          <p className="text-conduit-gray text-lg">Calculate return on investment for your transfer center operations</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Input Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-5 w-5 text-conduit-orange mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Input Parameters</h3>
            </div>
            
            <div className="max-w-md">
              <Label htmlFor="staffedBeds" className="text-sm font-medium text-gray-700 mb-2">
                Number of Staffed Beds
              </Label>
              <Input
                id="staffedBeds"
                type="number"
                min="1"
                placeholder="Enter number of staffed beds"
                value={staffedBeds}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-lg py-3 focus:ring-2 focus:ring-conduit-orange focus:border-conduit-orange"
              />
              <p className="text-sm text-gray-500 mt-2">Enter the total number of staffed beds in your facility</p>
            </div>
          </CardContent>
        </Card>

        {/* Assumptions Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Settings className="h-5 w-5 text-conduit-orange mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Calculation Assumptions</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {assumptions.slice(0, 3).map((assumption, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">{assumption.label}</span>
                    <span className="font-semibold text-gray-900">{assumption.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {assumptions.slice(3).map((assumption, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">{assumption.label}</span>
                    <span className="font-semibold text-gray-900">{assumption.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results ? (
          <>
            {/* Calculation Steps */}
            <Card className="mb-8 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Calculator className="h-5 w-5 text-conduit-orange mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Calculations</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Annual Transfer Volume */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Annual Transfer Volume</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Total Annual Transfers = {formatNumber(parseInt(staffedBeds))} × 12
                      </span>
                      <span className="text-xl font-semibold text-conduit-orange">
                        {formatNumber(results.totalAnnualTransfers)}
                      </span>
                    </div>
                  </div>

                  {/* Investment Cost */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Investment Cost</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Total Annual Investment = {formatNumber(results.totalAnnualTransfers)} × $200
                      </span>
                      <span className="text-xl font-semibold text-gray-700">
                        {formatCurrency(results.totalAnnualInvestmentCost)}
                      </span>
                    </div>
                  </div>

                  {/* Revenue Calculations */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Revenue Calculations</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Recaptured Leakage Revenue:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(results.recapturedLeakageRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">New Growth Revenue:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(results.newGrowthRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Operational Cost Savings:</span>
                        <span className="font-semibold text-green-600">$2,000,000</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-gray-900 font-medium">Total Gross Financial Benefit:</span>
                        <span className="text-xl font-semibold text-green-600">
                          {formatCurrency(results.totalGrossFinancialBenefit)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Net Benefit */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Net Benefit</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Net Annual Financial Benefit = {formatCurrency(results.totalGrossFinancialBenefit)} - {formatCurrency(results.totalAnnualInvestmentCost)}
                      </span>
                      <span className="text-xl font-semibold text-green-600">
                        {formatCurrency(results.netAnnualFinancialBenefit)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final ROI Result */}
            <Card className="shadow-xl border-2 border-orange-500">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-6">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Return on Investment</h3>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-teal-600 rounded-2xl p-8 mb-6">
                    <div className="text-7xl font-bold text-white mb-2">
                      {results.finalROI.toFixed(1)}:1
                    </div>
                    <p className="text-xl text-white opacity-90">ROI Ratio</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      An ROI ratio of <span className="font-bold text-orange-600">{results.finalROI.toFixed(1)}:1</span> means 
                      that for every <span className="font-semibold">$1</span> invested in your transfer center operations, 
                      you can expect to receive <span className="font-bold text-green-600">${results.finalROI.toFixed(1)}</span> in return. 
                      This represents a highly favorable investment opportunity for your hospital.
                    </p>
                  </div>
                  
                  {/* Email Button */}
                  <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Results
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-orange-500" />
                          Email ROI Analysis
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <strong>From:</strong> {fromEmail}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="emailTo">Send to Email Address</Label>
                          <Input
                            id="emailTo"
                            type="email"
                            placeholder="recipient@hospital.com"
                            value={emailTo}
                            onChange={(e) => setEmailTo(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSendEmail}
                            disabled={!emailTo || emailMutation.isPending}
                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                          >
                            {emailMutation.isPending ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Email
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEmailDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>


          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">Enter staffed beds to calculate ROI</h3>
            <p className="text-gray-400">Results will appear here automatically</p>
          </div>
        )}
      </div>
    </div>
  );
}
