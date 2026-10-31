# Requirements Document

## Introduction

ActivityTracker is a single-page activity logger built with plain HTML, CSS, and JavaScript, with no backend server. Users log activities that each carry a project, task, date, time, and number of hours, and rate how much they liked the activity on a 1-to-5 star scale. All activities persist in the browser's local storage so that data survives page reloads without any server. The application surfaces the best-rated activity to give users quick insight into their most-liked work.

## Glossary

- **ActivityTracker**: The single-page web application that lets a user log, rate, store, and review activities.
- **Activity**: A single logged record consisting of a project, a task, a date, a time, a number of hours, and a liked rating.
- **Project**: A free-text label identifying the broader effort an activity belongs to.
- **Task**: A free-text label describing the specific work performed in an activity.
- **Hours**: A positive decimal number representing the duration of an activity in hours.
- **Liked_Rating**: An integer from 1 to 5 representing how much the user liked an activity, expressed as stars.
- **Browser_Storage**: The browser's localStorage mechanism used to persist activities on the user's device.
- **Activity_List**: The visible collection of all stored activities rendered in the application.
- **Best_Rated_Activity**: The stored activity with the highest Liked_Rating.

## Requirements

### Requirement 1: Log an Activity

**User Story:** As a user, I want to log an activity with its project, task, date, time, and hours, so that I can keep a record of the work I have done.

#### Acceptance Criteria

1. WHEN the user opens the activity logging view, THE ActivityTracker SHALL present input fields for project, task, date, time, and hours.
2. WHEN the user submits the activity form with values for project, task, date, time, and hours, THE ActivityTracker SHALL create an Activity from the submitted values and add the Activity to the Activity_List.
3. WHEN an Activity is successfully added to the Activity_List, THE ActivityTracker SHALL display a confirmation and clear the form inputs.
4. IF the user submits the activity form with an empty project, THEN THE ActivityTracker SHALL reject the submission and display a validation message identifying the project field.
5. IF the user submits the activity form with an empty task, THEN THE ActivityTracker SHALL reject the submission and display a validation message identifying the task field.
6. IF the user submits the activity form with an empty date, THEN THE ActivityTracker SHALL reject the submission and display a validation message identifying the date field.
7. IF the user submits the activity form with an empty time, THEN THE ActivityTracker SHALL reject the submission and display a validation message identifying the time field.
8. IF the user submits the activity form with hours that are not a number greater than 0, THEN THE ActivityTracker SHALL reject the submission and display a validation message identifying the hours field.
9. IF the activity form submission is rejected due to validation, THEN THE ActivityTracker SHALL preserve the values the user already entered.

### Requirement 2: Rate an Activity

**User Story:** As a user, I want to rate each activity with a liked rating from 1 to 5 stars, so that I can record how much I enjoyed the work.

#### Acceptance Criteria

1. THE ActivityTracker SHALL present a star control offering exactly the integer values 1, 2, 3, 4, and 5 for setting the Liked_Rating of an Activity.
2. WHEN the user selects a star value from 1 to 5, THE ActivityTracker SHALL set the Liked_Rating and render the selected number of filled stars.
3. IF the user submits the activity form without selecting a Liked_Rating, THEN THE ActivityTracker SHALL reject the submission, display a validation message identifying the rating field, and preserve the other entered form values.
4. IF a Liked_Rating value outside the integer range 1 to 5 is supplied, THEN THE ActivityTracker SHALL reject the Liked_Rating value.
5. WHEN displaying an Activity in the Activity_List, THE ActivityTracker SHALL render its Liked_Rating as the corresponding number of filled stars out of five total star positions.

### Requirement 3: Persist Activities in Browser Storage

**User Story:** As a user, I want my activities saved in the browser, so that my records remain available after I reload or reopen the page.

#### Acceptance Criteria

1. WHEN an Activity is added to the Activity_List, THE ActivityTracker SHALL write the complete current Activity_List to Browser_Storage.
2. IF writing to Browser_Storage fails, THEN THE ActivityTracker SHALL retain the Activity_List in memory and display a message indicating the activity could not be saved.
3. WHEN the ActivityTracker loads, THE ActivityTracker SHALL read the stored Activity_List from Browser_Storage and populate the Activity_List with the stored activities in the order they were written.
4. WHERE Browser_Storage contains no stored Activity_List, THE ActivityTracker SHALL initialize the Activity_List as empty.
5. IF reading from Browser_Storage returns data that cannot be parsed into an Activity_List, THEN THE ActivityTracker SHALL initialize the Activity_List as empty, preserve the unparseable stored data without overwriting the unparseable stored data, and display a message indicating that stored activities could not be loaded.

### Requirement 4: Display the Activity List

**User Story:** As a user, I want to see all my logged activities, so that I can review my recorded work.

#### Acceptance Criteria

1. THE ActivityTracker SHALL display each Activity in the Activity_List showing its project, task, date, time, hours, and Liked_Rating.
2. WHEN an Activity is added to the Activity_List, THE ActivityTracker SHALL render the added Activity in the displayed Activity_List.
3. WHERE the Activity_List is empty, THE ActivityTracker SHALL display a message indicating that no activities have been logged.
4. THE ActivityTracker SHALL display the activities ordered by date and time, with the most recently recorded Activity shown first.

### Requirement 5: Show the Best-Rated Activity

**User Story:** As a user, I want to see my best-rated activity, so that I can quickly identify the work I liked most.

#### Acceptance Criteria

1. WHERE the Activity_List contains at least one Activity, THE ActivityTracker SHALL display the Best_Rated_Activity showing its project, task, date, time, hours, and Liked_Rating.
2. WHEN an Activity is added to the Activity_List, THE ActivityTracker SHALL recompute the Best_Rated_Activity from the current Activity_List and then display the Best_Rated_Activity.
3. WHERE two or more activities share the highest Liked_Rating, THE ActivityTracker SHALL display the most recently added Activity among those activities as the Best_Rated_Activity.
4. WHERE the Activity_List is empty, THE ActivityTracker SHALL display a message indicating that no best-rated activity is available.
