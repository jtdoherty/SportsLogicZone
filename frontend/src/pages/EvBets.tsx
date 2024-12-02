import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import axios from 'axios';
import Card from '../components/Card';
import FilterSelect from '../components/FilterSelect';

const sportOptions = [
  { value: 'all', label: 'All Sports' },
  { value: 'nfl', label: 'NFL' },
  { value: 'nba', label: 'NBA' },
  { value: 'mlb', label: 'MLB' },
  { value: 'nhl', label: 'NHL' },
];

const marketOptions = [
  { value: 'moneyline', label: 'Moneyline' },
  { value: 'spread', label: 'Spread' },
  { value: 'totals', label: 'Totals' },
  { value: 'props', label: 'Player Props' },
];

interface EvBet {
  event: string;
  bet: string;
  consensus_implied_probability: number;
  ev_bet_odds: number;
  roi: number;
  sport?: string;
  date?: string;
  time?: string;
}

export default function EvBets() {
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('moneyline');
  const [evBets, setEvBets] = useState<EvBet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvBets = async () => {
      try {
        const response = await axios.get('/data.json');
        setEvBets(response.data);
      } catch (error) {
        console.error('Error fetching EV bets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvBets();
  }, []);

  const filteredBets = evBets.filter(bet => {
    if (selectedSport !== 'all' && bet.sport?.toLowerCase() !== selectedSport) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">+EV Bet Finder</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Find positive expected value bets across multiple sportsbooks. Our algorithm compares odds
          and identifies opportunities where the true probability exceeds the implied probability.
        </p>
      </div>

      <div className="bg-[#0f1219] rounded-lg shadow-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FilterSelect
            label="Sport"
            value={selectedSport}
            onChange={setSelectedSport}
            options={sportOptions}
          />
          <FilterSelect
            label="Market"
            value={selectedMarket}
            onChange={setSelectedMarket}
            options={marketOptions}
          />
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Min. Edge %</label>
            <input
              type="number"
              min="0"
              max="100"
              defaultValue="2"
              className="w-full bg-[#1a1f2e] border border-gray-700 rounded-md px-4 py-2 text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card
          icon={Calculator}
          title="Edge Calculator"
          description="Calculate the exact edge percentage for any bet using our advanced probability model."
        />
        <Card
          icon={TrendingUp}
          title="Live Tracking"
          description="Monitor line movements and odds changes in real-time across all major sportsbooks."
        />
        <Card
          icon={DollarSign}
          title="Profit Calculator"
          description="Determine optimal bet sizes and calculate potential returns based on your bankroll."
        />
      </div>

      <div className="bg-[#0f1219] rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold">Current +EV Opportunities</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 bg-[#1a1f2e]">
                <th className="px-6 py-3">EVENT</th>
                <th className="px-6 py-3">+EV BET</th>
                <th className="px-6 py-3">CONSENSUS IMPLIED PROBABILITY</th>
                <th className="px-6 py-3">+EV BET ODDS</th>
                <th className="px-6 py-3">ROI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Loading opportunities...
                  </td>
                </tr>
              ) : filteredBets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No +EV opportunities found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredBets.map((bet, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-800 hover:bg-[#1a1f2e] transition-colors"
                  >
                    <td className="px-6 py-4">{bet.event}</td>
                    <td className="px-6 py-4">{bet.bet}</td>
                    <td className="px-6 py-4">{(bet.consensus_implied_probability * 100).toFixed(2)}%</td>
                    <td className="px-6 py-4">{bet.ev_bet_odds}</td>
                    <td className="px-6 py-4 text-green-400">
                      {(bet.roi * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}