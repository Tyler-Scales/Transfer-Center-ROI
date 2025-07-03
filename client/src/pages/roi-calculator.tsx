import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Settings, Calculator, TrendingUp, BarChart3 } from "lucide-react";
import ConduitLogo from "@assets/ConduitLogo_Color_1751505244592.png";

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
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-8">
          <img 
            src={ConduitLogo} 
            alt="Conduit Health Partners" 
            className="h-16 mx-auto mb-6"
          />
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
                  <h3 className="text-xl font-semibold text-gray-900">Calculation Steps</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Step 1: Annual Transfer Volume</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Total Annual Transfers = {formatNumber(parseInt(staffedBeds))} × 12
                      </span>
                      <span className="text-xl font-semibold text-conduit-orange">
                        {formatNumber(results.totalAnnualTransfers)}
                      </span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Step 2: Investment Cost</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">
                        Total Annual Investment = {formatNumber(results.totalAnnualTransfers)} × $200
                      </span>
                      <span className="text-xl font-semibold text-red-600">
                        {formatCurrency(results.totalAnnualInvestmentCost)}
                      </span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Step 3: Revenue Calculations</h4>
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

                  {/* Step 4 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Step 4: Net Benefit</h4>
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
            <div className="bg-gradient-to-r from-conduit-orange to-conduit-teal rounded-lg shadow-lg p-8 text-white text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 mr-3" />
                <h3 className="text-2xl font-bold">Return on Investment</h3>
              </div>
              <div className="text-6xl font-bold mb-4">
                {results.finalROI.toFixed(1)}%
              </div>
              <p className="text-xl opacity-90">Annual ROI Percentage</p>
              <div className="mt-6 text-lg opacity-80">
                Based on {formatNumber(parseInt(staffedBeds))} staffed beds
              </div>
            </div>
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
