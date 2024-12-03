
# **Omar's Tasks Tests Documentation**

## **Sample Data Objects**

---

### **Tourist User Example**
A tourist user account with basic profile settings:

```json
{
  "username": "touristUser2",
  "password": "$2b$10$N43v1m5Td7ehCsdGmZiUTe4RdzRvqax9s8vE0G5OMPW.8qRVnzGku",
  "email": "tourist2@example.com",
  "role": "TOURIST",
  "requested_to_be_deleted": false,
  "is_accepted": false,
  "is_new": true,
  "terms_and_conditions": false,
  "id": "674e5e344b4ee35f430510d9"
}
```

---

### **Tourist Profile Details**
Associated tourist profile with points and wallet information:

```json
{
  "user": "674e5e344b4ee35f430510d9",
  "points": 0,
  "level": 1,
  "wallet": 3000,
  "badges": [],
  "Total_points_collected": 0,
  "is_student": false,
  "id": "674e5e714b4ee35f430510db"
}
```

---

### **Tour Guide User Example**
A tour guide account with basic profile settings:

```json
{
  "username": "tourGuideUser",
  "password": "$2b$10$Px3CawTcn0IdRLSlRDEZWOlbKLoH7c.AXbxgTdqiwY.TCSTwwHJxW",
  "email": "tourguide@example.com",
  "role": "TOUR_GUIDE",
  "requested_to_be_deleted": false,
  "is_accepted": false,
  "is_new": true,
  "terms_and_conditions": false,
  "id": "674e53e140e7de4d3c8d4216"
}
```

---

### **Tour Guide Profile Details**
Associated tour guide profile with professional information:

```json
{
  "user": "674e53e140e7de4d3c8d4216",
  "phone_number": "0987654321",
  "years_of_experience": 5,
  "previous_work": "Various tours",
  "available": true,
  "id": "674e545940e7de4d3c8d4218"
}
```

---

### **Advertiser User Example**
An advertiser account with basic profile settings:

```json
{
  "username": "advertiserUser",
  "password": "$2b$10$tPw0X81IXyE/IgrqjgrYH./6rrR8dSHsBwEwD6R93XKoZdtgc2tuK",
  "email": "advertiser@example.com",
  "role": "ADVERTISER",
  "requested_to_be_deleted": false,
  "is_accepted": false,
  "is_new": true,
  "terms_and_conditions": false,
  "id": "674e548d40e7de4d3c8d421c"
}
```

---

### **Advertiser Profile Details**
Associated advertiser profile with company information:

```json
{
  "user": "674e548d40e7de4d3c8d421c",
  "company_name": "TravelAds Inc.",
  "id": "674e553140e7de4d3c8d421e"
}
```

---

### **Location Example**
A location coordinate object:

```json
{
  "latitude": 3,
  "longitude": 5,
  "id": "674e591640e7de4d3c8d4223"
}
```

---

### **Activity Example**
A tour activity listing:

```json
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
  "id": "674e5fc74b4ee35f430510e6"
}
```

---

### **Booking Example**
A booking record for an activity:

```json
{
  "activity": "674e5fc74b4ee35f430510e6",
  "tourist": "674e5e714b4ee35f430510db",
  "attended": false,
  "active": true,
  "id": "674e5fd84b4ee35f430510ec",
  "booking_date": "2024-12-03T01:33:12.790Z",
  "createdAt": "2024-12-03T01:33:12.790Z",
  "updatedAt": "2024-12-03T01:33:12.790Z"
}
```

---

### **Tourist Activities List Example**
A list of activities booked by a tourist:

```json
{
  "activities": [
    {
      "id": "674e5e814b4ee35f430510e1",
      "activity": {
        "id": "674e5e0c4b4ee35f430510d2",
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
      "updatedAt": "2024-12-03T01:27:29.042Z"
    },
    {
      "id": "674e5fd84b4ee35f430510ec",
      "activity": {
        "id": "674e5fc74b4ee35f430510e6",
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
      "updatedAt": "2024-12-03T01:33:12.790Z"
    }
  ],
  "itineraries": []
}
```

---

## **Notes**
- All IDs are MongoDB ObjectIDs.
- Timestamps are in ISO 8601 format.
- Passwords are hashed using bcrypt.
- Boolean flags are used for various status indicators.
- Foreign key relationships are maintained through ID references.

This documentation provides example objects for all major entities in the system, including users, profiles, activities, bookings, and locations.