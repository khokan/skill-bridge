export interface NavItem {
    title : string,
    href : string,
    icon : string
}

export interface NavSection {
    title ?: string,
    items : NavItem[]
}

export interface PieChartData {
    status: string,
    count: number
}

export interface BarChartData {
    month: Date | string,
    count: number
}

export interface BookingStatusBreakdown {
    status: string;
    _count: {
        status: number;
    };
}

export interface AdminDashboardStats {
    totalUsers: number;
    totalStudents: number;
    totalTutors: number;
    totalAdmins: number;
    activeUsers: number;
    bannedUsers: number;
    totalBookings: number;
    totalCategories: number;
    activeCategories: number;
    bookingByStatus: BookingStatusBreakdown[];
    barChartData: BarChartData[];
    pieChartData: PieChartData[];
}

export interface IAdminDashboardData {
    subscriptionCount : number;
    studentCount : number;
    adminCount : number;
    superAdminCount : number;
    paymentCount : number;
    userCount : number;
    totalRevenue : number;
    barChartData : BarChartData[];
    pieChartData : PieChartData[];
}
