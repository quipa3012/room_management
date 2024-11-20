use room_management;

-- Thêm dữ liệu vào bảng users (quản lý)
insert into users (username, password) values 
('quanly01', 'password123'),
('quanly02', 'password456');

-- Thêm dữ liệu vào bảng rooms (phòng trọ)
insert into rooms (room_id, capacity, price, status) values 
(101, 2, 3000000, 'đang trống'),
(102, 1, 2000000, 'đang trống'),
(103, 3, 3500000, 'đang trống'),
(104, 2, 3200000, 'đang thuê'),
(105, 1, 1800000, 'đang bảo trì');

-- Thêm dữ liệu vào bảng tenants (người thuê phòng)
insert into tenants (tenant_id, full_name, phone_number, date_of_birth, gender) values 
(1, 'Nguyễn Văn A', '0912345678', '1990-05-12', 1),
(2, 'Trần Thị B', '0987654321', '1988-03-25', 0),
(3, 'Lê Văn C', '0922334455', '1995-10-07', 1);

-- Thêm dữ liệu vào bảng rentals (hợp đồng thuê phòng)
insert into rentals (tenant_id, room_id, start_date, end_date, rental_price, deposit, payment_status, status) values 
(1, 104, '2024-01-01', '2024-12-31', 3200000, 1000000, 1, 'đang hiệu lực'),
(2, 105, '2024-02-15', '2024-08-15', 1800000, 500000, 0, 'đang hiệu lực');

-- Thêm dữ liệu vào bảng payments (thanh toán cho phòng trọ)
insert into payments (rental_id, payment_date, amount) values 
(1, '2024-01-05', 3200000),
(1, '2024-02-05', 3200000),
(2, '2024-02-20', 1800000);

-- Thêm dữ liệu vào bảng maintenance (lịch sử bảo trì phòng)
insert into maintenance (room_id, maintenance_date, description, expense) values 
(105, '2024-03-10', 'Bảo trì hệ thống điện', 500000),
(105, '2024-06-15', 'Sơn lại tường', 800000),
(104, '2024-07-01', 'Thay thế khóa cửa', 200000);
