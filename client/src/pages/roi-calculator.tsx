import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Settings, Calculator, TrendingUp, BarChart3, DollarSign } from "lucide-react";

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

    // Final ROI
    const finalROI = (netAnnualFinancialBenefit / totalAnnualInvestmentCost) * 100;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Enterprise Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-conduit-orange to-conduit-teal rounded-2xl shadow-lg mb-8">
              <Building2 className="h-12 w-12 text-white" />
            </div>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Hospital Transfer Center
              </h1>
              <h2 className="text-3xl font-semibold bg-gradient-to-r from-conduit-orange to-conduit-teal bg-clip-text text-transparent mb-6">
                ROI Calculator
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Enterprise-grade financial analysis tool designed to calculate precise return on investment 
                for hospital transfer center operations with industry-leading accuracy
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Input & Assumptions */}
          <div className="lg:col-span-4 space-y-8">
            {/* Input Section */}
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-md hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-conduit-orange/20 to-conduit-teal/20 rounded-xl flex items-center justify-center mr-4 shadow-inner">
                    <Building2 className="h-7 w-7 text-conduit-orange" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Input Parameters</h3>
                    <p className="text-gray-500 text-sm">Financial modeling inputs</p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="staffedBeds" className="text-lg font-semibold text-gray-800 mb-4 block">
                    Number of Staffed Beds
                  </Label>
                  <Input
                    id="staffedBeds"
                    type="number"
                    min="1"
                    placeholder="Enter staffed beds"
                    value={staffedBeds}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="text-2xl py-6 px-6 border-2 border-gray-200 focus:ring-4 focus:ring-conduit-orange/20 focus:border-conduit-orange transition-all duration-300 rounded-xl shadow-sm"
                  />
                  <p className="text-sm text-gray-500 mt-4 leading-relaxed font-medium">
                    Total staffed beds in your healthcare facility
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Assumptions Section */}
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-conduit-orange/20 to-conduit-teal/20 rounded-xl flex items-center justify-center mr-4 shadow-inner">
                    <Settings className="h-7 w-7 text-conduit-orange" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Financial Assumptions</h3>
                    <p className="text-gray-500 text-sm">Industry-validated parameters</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {assumptions.map((assumption, index) => (
                    <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700 font-medium text-sm leading-tight">{assumption.label}</span>
                      <span className="font-bold text-gray-900 text-lg">{assumption.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-8">
            {results ? (
              <div className="space-y-8">
                {/* Key Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-700 mb-2">
                        {results.finalROI.toFixed(1)}%
                      </div>
                      <div className="text-sm font-medium text-green-600">Annual ROI</div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-700 mb-2">
                        {formatCurrency(results.netAnnualFinancialBenefit)}
                      </div>
                      <div className="text-sm font-medium text-blue-600">Net Annual Benefit</div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-700 mb-2">
                        {formatNumber(results.totalAnnualTransfers)}
                      </div>
                      <div className="text-sm font-medium text-purple-600">Annual Transfers</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Analysis */}
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-md">
                  <CardContent className="p-10">
                    <div className="flex items-center mb-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-conduit-orange/20 to-conduit-teal/20 rounded-xl flex items-center justify-center mr-4 shadow-inner">
                        <Calculator className="h-7 w-7 text-conduit-orange" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900">Financial Analysis</h3>
                        <p className="text-gray-500">Comprehensive ROI breakdown and calculations</p>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Volume Analysis */}
                      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 border border-gray-100">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-conduit-orange/10 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-conduit-orange font-bold text-sm">1</span>
                          </div>
                          Transfer Volume Analysis
                        </h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Calculation Formula</div>
                            <div className="text-lg text-gray-800">
                              {formatNumber(parseInt(staffedBeds))} staffed beds × 12 transfers/bed/year
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Annual Transfer Volume</div>
                            <div className="text-3xl font-bold text-conduit-orange">
                              {formatNumber(results.totalAnnualTransfers)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Investment Analysis */}
                      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8 border border-gray-100">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-conduit-orange/10 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-conduit-orange font-bold text-sm">2</span>
                          </div>
                          Investment Requirements
                        </h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Calculation Formula</div>
                            <div className="text-lg text-gray-800">
                              {formatNumber(results.totalAnnualTransfers)} transfers × $200/transfer
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 mb-2">Total Annual Investment</div>
                            <div className="text-3xl font-bold text-gray-700">
                              {formatCurrency(results.totalAnnualInvestmentCost)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Revenue Analysis */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-green-600 font-bold text-sm">3</span>
                          </div>
                          Revenue Generation
                        </h4>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Leakage Recapture</div>
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(results.recapturedLeakageRevenue)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">New Growth Revenue</div>
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(results.newGrowthRevenue)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Cost Savings</div>
                            <div className="text-2xl font-bold text-green-600">
                              $2,000,000
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-green-200">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">Total Gross Financial Benefit</div>
                            <div className="text-4xl font-bold text-green-700">
                              {formatCurrency(results.totalGrossFinancialBenefit)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Final ROI */}
                      <div className="bg-gradient-to-r from-conduit-orange via-orange-500 to-conduit-teal rounded-2xl p-10 text-white text-center shadow-2xl">
                        <div className="mb-6">
                          <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-90" />
                          <h4 className="text-3xl font-bold mb-2">Return on Investment</h4>
                          <p className="text-xl opacity-90">Annual ROI Performance</p>
                        </div>
                        <div className="text-8xl font-bold mb-4 tracking-tight">
                          {results.finalROI.toFixed(1)}%
                        </div>
                        <div className="text-xl opacity-90">
                          Based on {formatNumber(parseInt(staffedBeds))} staffed beds
                        </div>
                        <div className="mt-6 text-lg opacity-80">
                          Net Annual Benefit: {formatCurrency(results.netAnnualFinancialBenefit)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Enterprise Empty State */
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-md h-full">
                <CardContent className="p-16 text-center flex flex-col justify-center h-full">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                    <BarChart3 className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-700 mb-4">Financial Analysis Ready</h3>
                  <p className="text-xl text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                    Enter the number of staffed beds to generate a comprehensive ROI analysis
                  </p>
                  <div className="text-base text-gray-400">
                    Real-time calculations • Enterprise-grade accuracy • Industry benchmarks
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}