'use client'
import { useState, useEffect } from "react";
import { Search, Filter, Home, MapPin, Clock } from "lucide-react";

// Simulated API function (Replace with real data)
const fetchRealEstateData = async () => {
  return {
    properties: [
      { id: 201, name: "Luxury Villa in Beverly Hills", price: "$5,200,000", location: "Beverly Hills, CA", size: "4,500 sq ft", lastSoldDate: "Jan 2023", availableSince: "2 months ago" },
      { id: 202, name: "Downtown Apartment", price: "$1,200,000", location: "Downtown, NY", size: "1,200 sq ft", lastSoldDate: "Mar 2022", availableSince: "1 month ago" },
      { id: 203, name: "Beach House in Malibu", price: "$3,800,000", location: "Malibu, CA", size: "3,000 sq ft", lastSoldDate: "Dec 2021", availableSince: "6 months ago" },
      { id: 204, name: "City Center Loft", price: "$900,000", location: "Los Angeles, CA", size: "900 sq ft", lastSoldDate: "Jun 2020", availableSince: "1 week ago" },
    ],
  };
};

const RealEstateHomePage = () => {
  const [data, setData] = useState({ properties: [] });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchRealEstateData();
      setData(fetchedData);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter based on search input
  const filteredProperties = data.properties.filter(property =>
    property.name.toLowerCase().includes(search.toLowerCase()) ||
    property.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" w-full min-h-screen text-white flex flex-col px-8 py-10">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-6 border-b border-gray-700 shadow-xl rounded-lg">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Real Estate Listings</h1>
        <div className="flex gap-4 items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search properties..."
              className="bg-gray-800 text-white px-12 py-3 rounded-full border-2 border-gray-600 focus:ring-2 focus:ring-blue-500 w-full"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 rounded-full hover:bg-gradient-to-l hover:from-blue-500 hover:to-purple-600 transition-all">
            <Filter size={20} />
            Filters
          </button>
        </div>
      </header>

      {/* Real Estate Properties Table */}
      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-2xl overflow-x-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 border-solid rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900">
                  <th className="p-4 text-left text-lg">Property Name</th>
                  <th className="p-4 text-left text-lg">Price</th>
                  <th className="p-4 text-left text-lg">Location</th>
                  <th className="p-4 text-left text-lg">Size</th>
                  <th className="p-4 text-left text-lg">Last Sold</th>
                  <th className="p-4 text-left text-lg">Available Since</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition duration-300"
                    >
                      <td className="p-4 flex items-center gap-3 text-sm whitespace-nowrap">
                        <Home size={20} />
                        <span>{property.name}</span>
                      </td>
                      <td className="p-4 text-sm">{property.price}</td>
                      <td className="p-4 text-sm">{property.location}</td>
                      <td className="p-4 text-sm">{property.size}</td>
                      <td className="p-4 text-sm">{property.lastSoldDate}</td>
                      <td className="p-4 text-sm">{property.availableSince}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-400">
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEstateHomePage;
