import React from "react";
import UserApp from "../components/userApp/UsserApp";
import { users } from "../config/config";

export default function UserPage() {
  const user = users[0]; // Ví dụ: chọn người dùng đầu tiên trong danh sách

  return (
    <div>
      <h1>User Chat Interface</h1>
      <UserApp user={user} />
    </div>
  );
}
