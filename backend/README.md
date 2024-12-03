**Omar's Tasks Tests :**
    {
    "username": "touristUser2",
    "password": "$2b$10$N43v1m5Td7ehCsdGmZiUTe4RdzRvqax9s8vE0G5OMPW.8qRVnzGku",
    "email": "tourist2@example.com",
    "role": "TOURIST",
    "requested_to_be_deleted": false,
    "is_accepted": false,
    "is_new": true,
    "terms_and_conditions": false,
    "_id": "674e5e344b4ee35f430510d9",
    "__v": 0
}

{
    "user": "674e5e344b4ee35f430510d9",
    "points": 0,
    "level": 1,
    "wallet": 3000,
    "badges": [],
    "Total_points_collected": 0,
    "is_student": false,
    "_id": "674e5e714b4ee35f430510db",
    "__v": 0
}

{
    "username": "tourGuideUser",
    "password": "$2b$10$Px3CawTcn0IdRLSlRDEZWOlbKLoH7c.AXbxgTdqiwY.TCSTwwHJxW",
    "email": "tourguide@example.com",
    "role": "TOUR_GUIDE",
    "requested_to_be_deleted": false,
    "is_accepted": false,
    "is_new": true,
    "terms_and_conditions": false,
    "_id": "674e53e140e7de4d3c8d4216",
    "__v": 0
}

{
    "user": "674e53e140e7de4d3c8d4216",
    "phone_number": "0987654321",
    "years_of_experience": 5,
    "previous_work": "Various tours",
    "available": true,
    "_id": "674e545940e7de4d3c8d4218",
    "__v": 0
}

{
    "username": "advertiserUser",
    "password": "$2b$10$tPw0X81IXyE/IgrqjgrYH./6rrR8dSHsBwEwD6R93XKoZdtgc2tuK",
    "email": "advertiser@example.com",
    "role": "ADVERTISER",
    "requested_to_be_deleted": false,
    "is_accepted": false,
    "is_new": true,
    "terms_and_conditions": false,
    "_id": "674e548d40e7de4d3c8d421c",
    "__v": 0
}

{
    "user": "674e548d40e7de4d3c8d421c",
    "company_name": "TravelAds Inc.",
    "_id": "674e553140e7de4d3c8d421e",
    "__v": 0
}

{
    "latitude": 3,
    "longitude": 5,
    "_id": "674e591640e7de4d3c8d4223",
    "__v": 0
}

{
    "title": "City Tour",
    "description": "A tour around the city",
    "advertiser": "674e553140e7de4d3c8d421e",
    "start_time": "2024-12-04T10:00:00.000Z",
    "duration": 30,
    "price": 50,
    "discount": 0,
    "location": "674e591640e7de4d3c8d4223",
    "tags": [],
    "booking_open": true,
    "flag_inapproperiate": false,
    "_id": "674e5fc74b4ee35f430510e6",
    "__v": 0
}

{
    "tour_guide": "674e545940e7de4d3c8d4218",
    "name": "Weekend Getaway",
    "description": "A relaxing weekend trip",
    "price": 200,
    "activities": [
        "674e592d40e7de4d3c8d4226"
    ],
    "accessibility": false,
    "start_date": "2024-01-05T00:00:00.000Z",
    "start_time": "13:00",
    "flag_inapproperiate": false,
    "_id": "674e59f240e7de4d3c8d4229",
    "__v": 0
}

{
    "activity": "674e5fc74b4ee35f430510e6",
    "tourist": "674e5e714b4ee35f430510db",
    "attended": false,
    "active": true,
    "_id": "674e5fd84b4ee35f430510ec",
    "booking_date": "2024-12-03T01:33:12.790Z",
    "createdAt": "2024-12-03T01:33:12.790Z",
    "updatedAt": "2024-12-03T01:33:12.790Z",
    "__v": 0
}

{
    "activities": [
        {
            "_id": "674e5e814b4ee35f430510e1",
            "activity": {
                "_id": "674e5e0c4b4ee35f430510d2",
                "title": "City Tour",
                "description": "A tour around the city",
                "start_time": "2025-01-01T10:00:00.000Z",
                "duration": 30,
                "price": 50,
                "location": "674e591640e7de4d3c8d4223"
            },
            "tourist": "674e5e714b4ee35f430510db",
            "attended": false,
            "active": true,
            "booking_date": "2024-12-03T01:27:29.042Z",
            "createdAt": "2024-12-03T01:27:29.042Z",
            "updatedAt": "2024-12-03T01:27:29.042Z",
            "__v": 0
        },
        {
            "_id": "674e5fd84b4ee35f430510ec",
            "activity": {
                "_id": "674e5fc74b4ee35f430510e6",
                "title": "City Tour",
                "description": "A tour around the city",
                "start_time": "2024-12-04T10:00:00.000Z",
                "duration": 30,
                "price": 50,
                "location": "674e591640e7de4d3c8d4223"
            },
            "tourist": "674e5e714b4ee35f430510db",
            "attended": false,
            "active": true,
            "booking_date": "2024-12-03T01:33:12.790Z",
            "createdAt": "2024-12-03T01:33:12.790Z",
            "updatedAt": "2024-12-03T01:33:12.790Z",
            "__v": 0
        }
    ],
    "itineraries": []
}
