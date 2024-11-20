-- tạo cơ sở dữ liệu
create database room_management character set utf8mb4 collate utf8mb4_unicode_ci;

-- sử dụng cơ sở dữ liệu vừa tạo
use room_management;

-- tạo bảng cho phòng trọ
create table rooms (
    room_id int primary key,
    capacity int default 1,
    price decimal(10, 2) not null,
    status varchar(50) default 'đang trống'
) character set utf8mb4 collate utf8mb4_unicode_ci;

-- tạo bảng cho người thuê phòng (tenants)
create table tenants (
    tenant_id varchar(12) primary key,
    full_name varchar(100) not null,
    phone_number varchar(20) not null,
    date_of_birth date,
    gender int not null,
    is_delete boolean default 0,
    created_at timestamp default current_timestamp
) character set utf8mb4 collate utf8mb4_unicode_ci;

-- tạo bảng cho hợp đồng thuê phòng
create table rentals (
    rental_id int auto_increment primary key,
    tenant_id varchar(12),
    room_id int,
    start_date date not null,
    end_date date not null,
    rental_price decimal(10, 2) not null,
    deposit decimal(10, 2) default 0,
    status varchar(50) default 'đang hiệu lực',
    created_at timestamp default current_timestamp,
    foreign key (tenant_id) references tenants(tenant_id) on delete cascade,
    foreign key (room_id) references rooms(room_id) on delete cascade
) character set utf8mb4 collate utf8mb4_unicode_ci;

-- tạo bảng thanh toán cho phòng trọ
create table payments (
    payment_id int auto_increment primary key,
    rental_id int,
    payment_date timestamp default current_timestamp,
    amount decimal(10, 2) not null,
    foreign key (rental_id) references rentals(rental_id) on delete cascade
) character set utf8mb4 collate utf8mb4_unicode_ci;

-- tạo bảng lịch sử bảo trì phòng
create table maintenance (
    maintenance_id int auto_increment primary key,
    room_id int,
    status int DEFAULT 0,
    maintenance_date timestamp default current_timestamp,
    description text,
    expense decimal(10, 2),
    foreign key (room_id) references rooms(room_id) on delete cascade
) character set utf8mb4 collate utf8mb4_unicode_ci;


