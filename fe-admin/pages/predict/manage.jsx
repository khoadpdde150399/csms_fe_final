// fe-admin/pages/predict/manage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import { swalert, swtoast } from '@/mixins/swal.mixin';
import { Pagination } from 'antd';

const ManagePage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchBy, setSearchBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterPredict, setFilterPredict] = useState('all');
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });



  useEffect(() => {
    const getFeedbacks = async () => {
      try {
        let requestData = {
          page: page,
          limit: 10,
          search: searchQuery,
          searchBy: searchBy
        };

        // Xử lý predict dựa vào filterPredict
        if (filterPredict !== 'all') {
          if (filterPredict === 'positive') {
            requestData.predict = 1;
          } else if (filterPredict === 'negative') {
            requestData.predict = 0;
          } else if (filterPredict === 'na') {
            requestData.predict = null;
          }
        }

        // Xử lý date search
        if (searchBy === 'date') {
          const dateData = JSON.parse(searchQuery || '{}');
          if (dateData.from) requestData.startDate = dateData.from;
          if (dateData.to) requestData.endDate = dateData.to;
          delete requestData.search;
          delete requestData.searchBy;
        }


        const response = await axios.post(
          'http://localhost:8080/api/feedback/getFeedback',
          requestData
        );
        console.log(response.data.data);
        setFeedbacks(response.data.data);
        setFilteredFeedbacks(response.data.data);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        swtoast.error({
          text: 'Error loading feedbacks'
        });
      }
    };

    getFeedbacks();
  }, [page, isSearch, isLoading, filterPredict]);
  const validateDateRange = (from, to) => {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    const today = new Date();

    if (fromDate && fromDate > today) {
      setDateError('From date cannot be in the future');
      return false;
    }

    if (toDate && toDate > today) {
      setDateError('To date cannot be in the future');
      return false;
    }

    if (fromDate && toDate && fromDate > toDate) {
      setDateError('From date cannot be greater than To date');
      return false;
    }

    setDateError('');
    return true;
  };

  const handleSearchChange = (e) => {
    if (searchBy === 'date') {
      const { name, value } = e.target;
      const newDateRange = { ...dateRange, [name]: value };
      
      if (validateDateRange(newDateRange.from, newDateRange.to)) {
        setDateRange(newDateRange);
        setSearchTerm(JSON.stringify(newDateRange)); // Convert to string for API
      }
      setDateRange(newDateRange);
    } else {
      setSearchTerm(e.target.value);
    }
  };

  const handleSearchByChange = (e) => {
    const newSearchBy = e.target.value;
    setSearchBy(newSearchBy);
    setSearchTerm('');
    setDateRange({ from: '', to: '' });
    setDateError('');
    
    setSearchQuery('');
  };

  const handleSearch = () => {
    if (searchBy === 'date') {
      if (dateError) {
        swtoast.error({
          text: 'Please select valid dates'
        });
        return;
      }

      setSearchQuery(JSON.stringify(dateRange));
    } else {
      setSearchQuery(searchTerm);
    }
    
    setIsSearch(!isSearch);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Nếu checkbox được check, lấy tất cả feedback_id
      const allFeedbackIds = filteredFeedbacks.map(feedback => feedback.feedback_id);
      setSelectedItems(allFeedbackIds);
    } else {
      // Nếu bỏ check, xóa hết selection
      setSelectedItems([]);
    }
  };
  const handleSelectItem = (feedbackId) => {
    setSelectedItems(prev => {
      if (prev.includes(feedbackId)) {
        return prev.filter(id => id !== feedbackId);
      } else {
        return [...prev, feedbackId];
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString()
    return `${day}/${month}/${year}`;
  };

  const handlePredict = async () => {
    try {
      if (selectedItems.length === 0) {
        swtoast.error({
          text: 'Please select at least one feedback to predict'
        });
        return;
      }

      setIsLoading(true);

      const selectedFeedbacks = filteredFeedbacks
        .filter(feedback => selectedItems.includes(feedback.feedback_id))
        .map(feedback => ({
          feedback_id: feedback.feedback_id,
          content: feedback.content,
          predict: feedback.predict
        }));

      const response = await axios.post(
        'http://localhost:8080/api/feedback/predict',
        selectedFeedbacks
      );

      if (response.data.data) {
        setFeedbacks(prevFeedbacks => {
          return prevFeedbacks.map(feedback => {
            const updatedFeedback = response.data.data.find(
              item => item.feedback_id === feedback.feedback_id
            );
            if (updatedFeedback) {
              return { ...feedback, predict: updatedFeedback.predict };
            }
            return feedback;
          });
        });

        setSelectedItems([]);
        setFilterPredict('all');
        setPage(1);
        setSearchQuery('');
        setSearchTerm('');
        swtoast.success({
          text: response.data.message || 'Predict successfully!'
        });
      }
    } catch (error) {
      console.error('Error predicting feedbacks:', error);
      swtoast.error({
        text: error.response?.data?.message || 'Error predicting feedbacks'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <Header title="Predict Management" />
      {/* Form tìm kiếm */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 mb-8 mt-8 md:justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {searchBy === 'date' ? (
            <div className="relative flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <input
                  type="date"
                  name="from"
                  value={dateRange.from}
                  onChange={handleSearchChange}
                  className={`w-full border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded pl-[16px] py-1.5 focus:outline-none focus:border-blue-500`}
                  placeholder="From Date"
                />
              </div>
              <div className="relative w-full sm:w-48">
                <input
                  type="date"
                  name="to"
                  value={dateRange.to}
                  onChange={handleSearchChange}
                  className={`w-full border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded pl-[16px] py-1.5 focus:outline-none focus:border-blue-500`}
                  placeholder="To Date"
                />
              </div>
              {dateError && (
                <p className="absolute text-red-500 text-xs mt-4 -bottom-5 left-0">{dateError}</p>
              )}
            </div>
          ) : (
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search"
              className="w-full sm:w-48 border border-gray-300 rounded pl-[16px] py-1.5 focus:outline-none focus:border-blue-500"
            />
          )}
          <select
            className="w-full sm:w-auto border border-gray-300 rounded py-1.5 focus:outline-none focus:border-blue-500"
            value={searchBy}
            onChange={handleSearchByChange}
          >
            <option value="all">Search All</option>
            <option value="content">Search by Feedback</option>
            <option value="product">Search by Product Name</option>
            <option value="email">Search by Email</option>
            <option value="date">Search by Date</option>
          </select>
          <select
            className="w-full sm:w-auto border border-gray-300 rounded px-3 py-2"
            value={filterPredict}
            onChange={(e) => setFilterPredict(e.target.value)}
          >
            <option value="all">All Feedbacks</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="na">Not Predict</option>
          </select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleSearch}
            className="flex-1 sm:flex-none bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
          <button
            onClick={handlePredict}
            className="flex-1 sm:flex-none bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed relative group"
            disabled={selectedItems.length === 0}
            title={selectedItems.length === 0 ? "Please select at least one feedback to predict" : ""}
          >
            Predict
            {selectedItems.length === 0 && (
              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 w-48 text-center">
                Please select at least one feedback to predict
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto -mx-6 md:mx-0">
        {filteredFeedbacks.length > 0 ? (
          <div className="min-w-[800px] md:min-w-0 px-6 md:px-0">
            <table className="w-full border-collapse">
              <thead className="hidden md:table-header-group">
                <tr>
                  <th className="text-black py-3 px-2 md:px-4 text-center border border-blue-500 w-[5%]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      onChange={handleSelectAll}
                      checked={selectedItems.length === filteredFeedbacks.length && filteredFeedbacks.length > 0}
                    />
                  </th>
                  <th className="text-black py-3 px-2 md:px-4  border border-blue-500 w-[25%]">Product Name</th>
                  <th className="text-black py-3 px-2 md:px-4  border border-blue-500 w-[15%]">User Email</th>
                  <th className="text-black py-3 px-2 md:px-4  border border-blue-500 w-[30%]">Feedback</th>
                  <th className="text-black py-3 px-2 md:px-4 text-center border border-blue-500 w-[10%]">Predict</th>
                  <th className="text-black py-3 px-2 md:px-4 text-center border border-blue-500 w-[15%]">Feedback Date</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {filteredFeedbacks.map((feedback) => (
                  <tr 
                    key={feedback.feedback_id} 
                    className="hover:bg-gray-200 block md:table-row mb-6 md:mb-0 cursor-pointer"
                    onClick={(e) => {
                      // Không trigger khi click vào checkbox để tránh double toggle
                      handleSelectItem(feedback.feedback_id);
                    }}
                  >
                    <td 
                      className="border border-gray-300 py-2 px-2 md:px-4 text-center w-full md:w-[5%] block md:table-cell"
                      onClick={(e) => e.stopPropagation()} // Ngăn chặn event bubbling khi click vào td chứa checkbox
                    >
                      <div className="md:hidden font-bold mb-1">Select</div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedItems.includes(feedback.feedback_id)}
                        onChange={() => handleSelectItem(feedback.feedback_id)}
                      />
                    </td>
                    <td className="border border-gray-300 py-2 px-2 md:px-4 text-left w-full md:w-[25%] block md:table-cell">
                      <div className="md:hidden font-bold mb-1">Product Name</div>
                      {feedback.product_variant?.Product?.product_name || 'N/A'}
                    </td>
                    <td className="border border-gray-300 py-2 px-2 md:px-4 text-left w-full md:w-[15%] block md:table-cell">
                      <div className="md:hidden font-bold mb-1">User Email</div>
                      {feedback.User?.email || 'N/A'}
                    </td>
                    <td className="border border-gray-300 py-2 px-2 md:px-4 text-left w-full md:w-[30%] block md:table-cell">
                      <div className="md:hidden font-bold mb-1">Feedback</div>
                      {feedback.content}
                    </td>
                    <td className="border border-gray-300 py-2 px-2 md:px-4 text-left md:text-center w-full md:w-[10%] block md:table-cell">
                      <div className="md:hidden font-bold mb-1">Predict</div>
                      {feedback.predict === null ? 'Not Predicted' : feedback.predict === 1 ? 'Positive' : 'Negative'}
                    </td>
                    <td className="border border-gray-300 py-2 px-2 md:px-4 text-left md:text-center w-full md:w-[15%] block md:table-cell">
                      <div className="md:hidden font-bold mb-1">Feedback Date</div>
                      {formatDate(feedback.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 border rounded-lg mx-6 md:mx-0">
            <p className="text-gray-500 text-lg">No matching content found</p>
          </div>
        )}
      </div>

      {/* Phân trang */}
      {filteredFeedbacks.length > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            total={totalPages * 10} // Nhân với 10 vì mỗi trang có 10 items
            pageSize={10}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => `Total ${feedbacks.length} items`}
          />
        </div>
      )}
    </div>
  );
};

export default ManagePage;