import { useState } from "react";
import "./Searchbar.css";
import { Search } from "@mui/icons-material";
const TopSearchbar = () => {
  const [searchField, setSearchField] = useState("customer");
  const [searchData, setSearchData] = useState("");

  // Handle the search logic
  const handleGoSearch = () => {
    if (!searchData.trim()) {
      alert("Please enter a search term.");
      return;
    }

    const routes = {
      "job-card": `/dashboard/jobcard-list`,
      quotation: `/dashboard/quotation-list`,
      invoice: `/dashboard/create-invoice-list`,
      "money-receipt": `/dashboard/money-receipt-list`,
      customer: `/dashboard/customer-list`,
      company: `/dashboard/company-list`,
      showroom: `/dashboard/show-room-list`,
    };

    const route = routes[searchField];
    if (route) {
      window.location.href = `${route}?search=${searchData}`;
    } else {
      alert("Invalid search field selected.");
    }
  };

  // Handle key press event
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGoSearch();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className="bg-white text-black px-2 py-1 rounded border searchbar"
      >
        <option value="job-card">Job card</option>
        <option value="quotation">Quotation</option>
        <option value="invoice">Invoice</option>
        <option value="money-receipt">Money receipt</option>
        <option value="customer">Customer </option>
        <option value="company">Company </option>
        <option value="showroom">Show Room </option>
      </select>

      <div className="relative flex-grow">
        <input
          type="text" 
          placeholder="Search"
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!searchField}
          className="lg:w-[92px] xl:w-full px-2 py-1 border rounded text-black disabled:bg-gray-200 searchInput "
        />
        <button
          onClick={handleGoSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-black"
        >
          <Search />
        </button>
      </div>
    </div>
  );
};

export default TopSearchbar;
