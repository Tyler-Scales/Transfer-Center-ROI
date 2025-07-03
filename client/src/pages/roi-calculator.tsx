import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Settings, Calculator, TrendingUp, BarChart3 } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-conduit-orange/10 rounded-full mb-6">
              <Building2 className="h-10 w-10 text-conduit-orange" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Hospital Transfer Center</h1>
            <h2 className="text-2xl font-semibold text-conduit-orange mb-4">ROI Calculator</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Calculate return on investment for your transfer center operations with precision and clarity
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Input Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-conduit-orange/10 rounded-lg flex items-center justify-center mr-4">
                <Building2 className="h-6 w-6 text-conduit-orange" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Input Parameters</h3>
                <p className="text-gray-600">Enter your facility details below</p>
              </div>
            </div>
            
            <div className="max-w-md">
              <Label htmlFor="staffedBeds" className="text-base font-semibold text-gray-800 mb-3 block">
                Number of Staffed Beds
              </Label>
              <Input
                id="staffedBeds"
                type="number"
                min="1"
                placeholder="Enter number of staffed beds"
                value={staffedBeds}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-xl py-4 px-4 border-2 border-gray-200 focus:ring-2 focus:ring-conduit-orange focus:border-conduit-orange transition-all duration-200"
              />
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">Enter the total number of staffed beds in your facility to calculate ROI</p>
            </div>
          </CardContent>
        </Card>

        {/* Assumptions Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-conduit-orange/10 rounded-lg flex items-center justify-center mr-4">
                <Settings className="h-6 w-6 text-conduit-orange" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Calculation Assumptions</h3>
                <p className="text-gray-600">Industry-standard metrics used in our calculations</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {assumptions.slice(0, 3).map((assumption, index) => (
                  <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">{assumption.label}</span>
                    <span className="font-bold text-gray-900">{assumption.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {assumptions.slice(3).map((assumption, index) => (
                  <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-medium">{assumption.label}</span>
                    <span className="font-bold text-gray-900">{assumption.value}</span>
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
            <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-conduit-orange/10 rounded-lg flex items-center justify-center mr-4">
                    <Calculator className="h-6 w-6 text-conduit-orange" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Calculation Steps</h3>
                    <p className="text-gray-600">Detailed breakdown of your ROI calculation</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Step 1: Annual Transfer Volume</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-lg">
                        Total Annual Transfers = {formatNumber(parseInt(staffedBeds))} × 12
                      </span>
                      <span className="text-2xl font-bold text-conduit-orange">
                        {formatNumber(results.totalAnnualTransfers)}
                      </span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Step 2: Investment Cost</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-lg">
                        Total Annual Investment = {formatNumber(results.totalAnnualTransfers)} × $200
                      </span>
                      <span className="text-2xl font-bold text-gray-700">
                        {formatCurrency(results.totalAnnualInvestmentCost)}
                      </span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Step 3: Revenue Calculations</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-700 text-lg">Recaptured Leakage Revenue:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {formatCurrency(results.recapturedLeakageRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 text-lg">New Growth Revenue:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {formatCurrency(results.newGrowthRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 text-lg">Operational Cost Savings:</span>
                        <span className="font-bold text-green-600 text-lg">$2,000,000</span>
                      </div>
                      <hr className="my-4 border-gray-300" />
                      <div className="flex justify-between">
                        <span className="text-gray-900 font-bold text-lg">Total Gross Financial Benefit:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(results.totalGrossFinancialBenefit)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Step 4: Net Benefit</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-lg">
                        Net Annual Financial Benefit = {formatCurrency(results.totalGrossFinancialBenefit)} - {formatCurrency(results.totalAnnualInvestmentCost)}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.netAnnualFinancialBenefit)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final ROI Result */}
            <div className="bg-gradient-to-r from-conduit-orange to-conduit-teal rounded-xl shadow-xl p-12 text-white text-center">
              <div className="flex items-center justify-center mb-6">
                <TrendingUp className="h-12 w-12 mr-4" />
                <h3 className="text-3xl font-bold">Return on Investment</h3>
              </div>
              <div className="text-7xl font-bold mb-6">
                {results.finalROI.toFixed(1)}%
              </div>
              <p className="text-2xl opacity-90 mb-4">Annual ROI Percentage</p>
              <div className="mt-8 text-xl opacity-80">
                Based on {formatNumber(parseInt(staffedBeds))} staffed beds
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-4">Enter staffed beds to calculate ROI</h3>
            <p className="text-gray-500 text-lg">Results will appear here automatically as you type</p>
          </div>
        )}
      </div>
    </div>
  );
}