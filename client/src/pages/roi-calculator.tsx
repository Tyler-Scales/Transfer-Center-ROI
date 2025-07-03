import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Settings, Calculator, TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

  const formatCompactCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
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
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      An ROI ratio of <span className="font-bold text-orange-600">{results.finalROI.toFixed(1)}:1</span> means 
                      that for every <span className="font-semibold">$1</span> invested in your transfer center operations, 
                      you can expect to receive <span className="font-bold text-green-600">${results.finalROI.toFixed(1)}</span> in return. 
                      This represents a highly favorable investment opportunity for your hospital.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown Chart */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <PieChart className="h-5 w-5 text-orange-500 mr-3" />
                  <CardTitle>Revenue Source Breakdown</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <PieChart 
                          data={[
                            { name: 'Operational Cost Savings', value: ANNUAL_OPERATIONAL_COST_SAVINGS, color: '#10B981' },
                            { name: 'Recaptured Leakage Revenue', value: results.recapturedLeakageRevenue, color: '#F59E0B' },
                            { name: 'New Growth Revenue', value: results.newGrowthRevenue, color: '#3B82F6' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[
                            { name: 'Operational Cost Savings', value: ANNUAL_OPERATIONAL_COST_SAVINGS, color: '#10B981' },
                            { name: 'Recaptured Leakage Revenue', value: results.recapturedLeakageRevenue, color: '#F59E0B' },
                            { name: 'New Growth Revenue', value: results.newGrowthRevenue, color: '#3B82F6' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </PieChart>
                        <Tooltip formatter={(value: number) => formatCompactCurrency(value)} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                        <span className="text-sm font-medium">Operational Cost Savings</span>
                      </div>
                      <span className="font-bold text-green-600">{formatCurrency(ANNUAL_OPERATIONAL_COST_SAVINGS)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-amber-500 rounded mr-3"></div>
                        <span className="text-sm font-medium">Recaptured Leakage Revenue</span>
                      </div>
                      <span className="font-bold text-amber-600">{formatCurrency(results.recapturedLeakageRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                        <span className="text-sm font-medium">New Growth Revenue</span>
                      </div>
                      <span className="font-bold text-blue-600">{formatCurrency(results.newGrowthRevenue)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sensitivity Analysis */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-orange-500 mr-3" />
                  <CardTitle>Sensitivity Analysis - ROI by Bed Count</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={[
                      { beds: 50, roi: calculateROI(50).finalROI.toFixed(1) },
                      { beds: 100, roi: calculateROI(100).finalROI.toFixed(1) },
                      { beds: 200, roi: calculateROI(200).finalROI.toFixed(1) },
                      { beds: 300, roi: calculateROI(300).finalROI.toFixed(1) },
                      { beds: 500, roi: calculateROI(500).finalROI.toFixed(1) },
                      { beds: 750, roi: calculateROI(750).finalROI.toFixed(1) },
                      { beds: 1000, roi: calculateROI(1000).finalROI.toFixed(1) }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="beds" />
                    <YAxis label={{ value: 'ROI Ratio', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: string) => [`${value}:1`, 'ROI Ratio']} />
                    <Bar dataKey="roi" fill="#F97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Industry Benchmarking */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-orange-500 mr-3" />
                  <CardTitle>Industry Benchmarking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Your ROI Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <span className="font-medium">Your ROI Ratio</span>
                        <span className="text-xl font-bold text-orange-600">{results.finalROI.toFixed(1)}:1</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Industry Average</span>
                        <span className="text-lg font-semibold text-gray-700">3.5:1</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Top Quartile</span>
                        <span className="text-lg font-semibold text-gray-700">6.0:1</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Performance Rating</h4>
                    <div className="space-y-3">
                      {results.finalROI >= 6.0 ? (
                        <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                          <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-semibold text-green-800">Exceptional Performance</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">Your ROI is in the top quartile of healthcare transfer centers.</p>
                        </div>
                      ) : results.finalROI >= 3.5 ? (
                        <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                          <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="font-semibold text-blue-800">Above Average</span>
                          </div>
                          <p className="text-sm text-blue-700 mt-1">Your ROI exceeds the industry average by {((results.finalROI / 3.5 - 1) * 100).toFixed(0)}%.</p>
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-100 border border-amber-300 rounded-lg">
                          <div className="flex items-center">
                            <Activity className="h-5 w-5 text-amber-600 mr-2" />
                            <span className="font-semibold text-amber-800">Below Average</span>
                          </div>
                          <p className="text-sm text-amber-700 mt-1">Consider optimization strategies to improve ROI performance.</p>
                        </div>
                      )}
                    </div>
                  </div>
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
