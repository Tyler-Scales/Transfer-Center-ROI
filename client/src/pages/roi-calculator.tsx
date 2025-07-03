import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Settings, Calculator, TrendingUp, BarChart3, Mail, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import conduitCoverImage from "@assets/conduit_health_partners_cover_1751549838249.jpg";

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
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [wantsTeamContact, setWantsTeamContact] = useState<boolean>(false);
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
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #f9f9f9; 
            }
            .container { background: white; margin: 20px 0; }
            .header { 
              background: linear-gradient(135deg, #F97316, #0D9488); 
              color: white; 
              padding: 30px 20px; 
              text-align: center; 
            }
            .content { padding: 30px; }
            .intro { font-size: 16px; margin-bottom: 30px; }
            .roi-highlight { 
              background: linear-gradient(135deg, #F97316, #0D9488); 
              color: white; 
              padding: 30px; 
              text-align: center; 
              margin: 30px 0; 
              border-radius: 12px; 
            }
            .roi-number { font-size: 48px; font-weight: bold; margin: 10px 0; }
            .section { margin: 25px 0; }
            .section-title { 
              color: #F97316; 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 15px; 
              border-bottom: 2px solid #F97316; 
              padding-bottom: 5px; 
            }
            .assumption-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
              margin: 15px 0; 
            }
            .assumption-item { 
              background: #f8f9fa; 
              padding: 12px; 
              border-radius: 6px; 
              border-left: 4px solid #0D9488; 
            }
            .calculation-step { 
              background: #f8f9fa; 
              padding: 15px; 
              margin: 15px 0; 
              border-radius: 8px; 
              border-left: 4px solid #F97316; 
            }
            .cta-section { 
              background: #f8f9fa; 
              padding: 25px; 
              margin: 30px 0; 
              border-radius: 12px; 
              text-align: center; 
            }
            .cta-button { 
              display: inline-block; 
              background: #0D9488; 
              color: white; 
              padding: 12px 25px; 
              text-decoration: none; 
              border-radius: 6px; 
              font-weight: bold; 
              margin: 10px; 
            }
            .footer { 
              text-align: center; 
              color: #666; 
              font-size: 14px; 
              margin-top: 30px; 
              padding: 20px; 
              background: #f8f9fa; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Transfer Center ROI Analysis</h1>
              <p>Conduit Health Partners</p>
            </div>
            
            <div class="content">
              <div class="intro">
                <p>I hope this analysis finds you well. Based on your hospital's ${formatNumber(beds)} staffed beds, I've prepared a comprehensive ROI analysis for implementing a dedicated transfer center operation.</p>
                
                <p>The results show significant potential for your organization, and I believe this investment could substantially impact your hospital's operational efficiency and revenue growth.</p>
              </div>
              
              <div class="roi-highlight">
                <h2>Your Projected ROI</h2>
                <div class="roi-number">${results.finalROI.toFixed(1)}:1</div>
                <p>For every $1 invested, you can expect $${results.finalROI.toFixed(1)} in return</p>
                <p><strong>Net Annual Financial Benefit: ${formatCurrency(results.netAnnualFinancialBenefit)}</strong></p>
              </div>
              
              <div class="section">
                <div class="section-title">Key Assumptions</div>
                <div class="assumption-grid">
                  <div class="assumption-item">
                    <strong>Annual Investment:</strong><br>$150,000
                  </div>
                  <div class="assumption-item">
                    <strong>Transfers per Bed:</strong><br>12 annually
                  </div>
                  <div class="assumption-item">
                    <strong>Cost per Transfer:</strong><br>$200
                  </div>
                  <div class="assumption-item">
                    <strong>Net Revenue per Admission:</strong><br>$10,000
                  </div>
                  <div class="assumption-item">
                    <strong>Leakage Rate:</strong><br>20%
                  </div>
                  <div class="assumption-item">
                    <strong>Growth Rate:</strong><br>1% new volume
                  </div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Financial Impact Breakdown</div>
                
                <div class="calculation-step">
                  <h4>Annual Transfer Volume</h4>
                  <p>${formatNumber(beds)} beds × 12 transfers = <strong>${formatNumber(results.totalAnnualTransfers)} total transfers</strong></p>
                </div>
                
                <div class="calculation-step">
                  <h4>Investment Cost</h4>
                  <p>${formatNumber(results.totalAnnualTransfers)} transfers × $200 = <strong>${formatCurrency(results.totalAnnualInvestmentCost)}</strong></p>
                </div>
                
                <div class="calculation-step">
                  <h4>Financial Benefits</h4>
                  <p>• Operational Cost Savings: <strong>${formatCurrency(150000)}</strong></p>
                  <p>• Recaptured Leakage Revenue: <strong>${formatCurrency(results.recapturedLeakageRevenue)}</strong></p>
                  <p>• New Growth Revenue: <strong>${formatCurrency(results.newGrowthRevenue)}</strong></p>
                  <p style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
                    <strong>Total Gross Financial Benefit: ${formatCurrency(results.totalGrossFinancialBenefit)}</strong>
                  </p>
                </div>
              </div>
              
              <div class="cta-section">
                <h3>Ready to Explore This Opportunity?</h3>
                <p>These numbers represent a compelling business case, but every hospital's situation is unique. I'd love to discuss how we can tailor this analysis to your specific operational context and explore implementation strategies that maximize your ROI.</p>
                
                <p>Let's schedule a conversation to dive deeper into:</p>
                <ul style="text-align: left; display: inline-block;">
                  <li>Customizing assumptions to your hospital's data</li>
                  <li>Implementation timeline and milestones</li>
                  <li>Risk mitigation strategies</li>
                  <li>Potential for even greater returns</li>
                </ul>
                
                <p><strong>I'm here to help you make the most informed decision for your organization.</strong></p>
                
                <a href="https://www.linkedin.com/in/tylerwallace/" class="cta-button">Connect with Tyler Wallace</a>
              </div>
              
              <div class="footer">
                <p>This analysis is based on industry-standard benchmarks and assumptions. Actual results may vary based on your hospital's specific circumstances and implementation approach.</p>
                <p><strong>Generated by Conduit Health Partners ROI Calculator</strong></p>
              </div>
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
    // Reset results when input changes
    if (hasCalculated) {
      setResults(null);
      setHasCalculated(false);
    }
  };

  const handleCalculate = async () => {
    const beds = parseInt(staffedBeds);
    if (!beds || beds <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number of staffed beds.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation time with animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const calculationResults = calculateROI(beds);
    setResults(calculationResults);
    setIsCalculating(false);
    setHasCalculated(true);
  };

  const handleReset = () => {
    setStaffedBeds("");
    setResults(null);
    setHasCalculated(false);
    setEmailTo("");
    setWantsTeamContact(false);
    setIsEmailDialogOpen(false);
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
    <div className="min-h-screen bg-gray-50">
      {/* Conduit Health Partners Cover Image */}
      <div className="w-full">
        <img 
          src={conduitCoverImage} 
          alt="Conduit Health Partners" 
          className="w-full h-32 md:h-48 object-cover"
        />
      </div>

      <div className="py-8 px-4">
        {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Transfer Center ROI Calculator</h1>
          <p className="text-gray-600 text-lg">This ROI calculator determines how much you can save when you trust <span className="font-bold text-conduit-orange">Conduit</span> with your transfer center needs. Enter your hospital's staffed bed count below to see your potential <span className="font-bold text-conduit-orange">return on investment</span> from partnering with our <span className="font-bold text-conduit-orange">expert transfer center team</span>.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Input Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-5 w-5 text-conduit-orange mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Share About Your Hospital</h3>
            </div>
            
            <div className="max-w-md">
              <Label htmlFor="staffedBeds" className="text-sm font-medium text-gray-700 mb-2">
                Number of Staffed Beds
              </Label>
              <div className="flex gap-3">
                <Input
                  id="staffedBeds"
                  type="number"
                  min="1"
                  placeholder="Enter number of staffed beds"
                  value={staffedBeds}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-lg py-3 focus:ring-2 focus:ring-conduit-orange focus:border-conduit-orange flex-1"
                  disabled={isCalculating}
                />
                <Button
                  onClick={handleCalculate}
                  disabled={!staffedBeds || parseInt(staffedBeds) <= 0 || isCalculating}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-semibold"
                >
                  {isCalculating ? "Calculating..." : "Calculate"}
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={isCalculating}
                  variant="outline"
                  className="px-6 py-3 text-lg font-semibold border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Reset
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Enter the total number of staffed beds in your facility</p>
            </div>
          </CardContent>
        </Card>

        {/* Loading Animation */}
        {isCalculating && (
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  {/* Animated Ring */}
                  <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  
                  {/* Calculator Icon in Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calculator className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Calculating ROI...</h3>
                  <p className="text-gray-600">Analyzing your transfer center investment potential</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final ROI Result */}
        {results && !isCalculating && (
          <Card className="mb-8 shadow-xl border-2 border-orange-500">
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
              </div>
                
              {/* Email Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                <div className="flex-1">
                  <p className="text-gray-700 text-lg mb-4">
                    Email this analysis to yourself so you can reference it later and share with your team.
                  </p>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="teamContact"
                      checked={wantsTeamContact}
                      onCheckedChange={(checked) => setWantsTeamContact(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="teamContact" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                      Check if you'd like to hear from our team about how we can make this ROI a reality at your hospital
                    </label>
                  </div>
                </div>
                
                <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 whitespace-nowrap">
                      <Mail className="h-6 w-6" />
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
        )}

        {/* Assumptions Section */}
        {results && !isCalculating && (
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
        )}

        {/* Results Section */}
        {results && !isCalculating ? (
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




          </>
        ) : !isCalculating ? (
          /* Empty State */
          <div className="text-center py-12">
            <BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">Enter staffed beds and click Calculate</h3>
            <p className="text-gray-400">Your ROI analysis will appear here</p>
          </div>
        ) : null}
      </div>
      </div>
    </div>
  );
}
