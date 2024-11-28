
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

// Visitor class to store details of visitors
class Visitor {
    String id, name, contact, purpose;
    String checkInTime = "Not Checked-In";
    String checkOutTime = "Not Checked-Out";

    public Visitor(String id, String name, String contact, String purpose) {
        this.id = id;
        this.name = name;
        this.contact = contact;
        this.purpose = purpose;
    }

    @Override
    public String toString() {
        return "ID: " + id + ", Name: " + name + ", Contact: " + contact + ", Purpose: " + purpose +
                ", Check-In Time: " + checkInTime + ", Check-Out Time: " + checkOutTime;
    }
}

// Manager class to handle visitor operations
class VisitorManager {
    ArrayList<Visitor> visitors = new ArrayList<>();

    public void registerVisitor(String id, String name, String contact, String purpose) {
        visitors.add(new Visitor(id, name, contact, purpose));
    }

    public Visitor findVisitor(String id) {
        for (Visitor visitor : visitors) {
            if (visitor.id.equals(id)) {
                return visitor;
            }
        }
        return null;
    }

    public void checkIn(String id, String checkInTime) {
        Visitor visitor = findVisitor(id);
        if (visitor != null) {
            visitor.checkInTime = checkInTime;
        }
    }

    public void checkOut(String id, String checkOutTime) {
        Visitor visitor = findVisitor(id);
        if (visitor != null) {
            visitor.checkOutTime = checkOutTime;
        }
    }

    public ArrayList<Visitor> getAllVisitors() {
        return visitors;
    }
}

// Main GUI class for the Visitor Management System
public class VisitorManagementSystem extends Frame implements ActionListener {
    VisitorManager manager = new VisitorManager();
    TextField idField, nameField, contactField, purposeField, checkInField, checkOutField;
    TextArea outputArea;

    public VisitorManagementSystem() {
        // Frame setup
        setTitle("Visitor Management System");
        setSize(600, 500);
        setLayout(new FlowLayout());

        // Labels and text fields
        Label idLabel = new Label("Visitor ID:");
        idField = new TextField(20);

        Label nameLabel = new Label("Name:");
        nameField = new TextField(20);

        Label contactLabel = new Label("Contact:");
        contactField = new TextField(20);

        Label purposeLabel = new Label("Purpose:");
        purposeField = new TextField(20);

        Label checkInLabel = new Label("Check-In Time (HH:mm):");
        checkInField = new TextField(10);

        Label checkOutLabel = new Label("Check-Out Time (HH:mm):");
        checkOutField = new TextField(10);

        // Buttons
        Button registerButton = new Button("Register");
        Button checkInButton = new Button("Check-In");
        Button checkOutButton = new Button("Check-Out");
        Button showVisitorsButton = new Button("Show Visitors");

        // Text area for output
        outputArea = new TextArea(15, 50);

        // Add components to the frame
        add(idLabel);
        add(idField);
        add(nameLabel);
        add(nameField);
        add(contactLabel);
        add(contactField);
        add(purposeLabel);
        add(purposeField);
        add(checkInLabel);
        add(checkInField);
        add(checkOutLabel);
        add(checkOutField);

        add(registerButton);
        add(checkInButton);
        add(checkOutButton);
        add(showVisitorsButton);
        add(outputArea);

        // Add action listeners to buttons
        registerButton.addActionListener(this);
        checkInButton.addActionListener(this);
        checkOutButton.addActionListener(this);
        showVisitorsButton.addActionListener(this);

        // Add window listener for closing
        addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }
        });
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        String command = e.getActionCommand();
        String id = idField.getText();
        String name = nameField.getText();
        String contact = contactField.getText();
        String purpose = purposeField.getText();
        String checkInTime = checkInField.getText();
        String checkOutTime = checkOutField.getText();

        switch (command) {
            case "Register":
                if (!id.isEmpty() && !name.isEmpty() && !contact.isEmpty() && !purpose.isEmpty()) {
                    manager.registerVisitor(id, name, contact, purpose);
                    outputArea.setText("Visitor Registered: " + name);
                } else {
                    outputArea.setText("Please fill in all fields to register.");
                }
                break;
            case "Check-In":
                if (!id.isEmpty() && !checkInTime.isEmpty()) {
                    manager.checkIn(id, checkInTime);
                    outputArea.setText("Visitor Checked In at " + checkInTime);
                } else {
                    outputArea.setText("Enter Visitor ID and Check-In Time.");
                }
                break;
            case "Check-Out":
                if (!id.isEmpty() && !checkOutTime.isEmpty()) {
                    manager.checkOut(id, checkOutTime);
                    outputArea.setText("Visitor Checked Out at " + checkOutTime);
                } else {
                    outputArea.setText("Enter Visitor ID and Check-Out Time.");
                }
                break;
            case "Show Visitors":
                outputArea.setText("All Visitors:\n");
                for (Visitor visitor : manager.getAllVisitors()) {
                    outputArea.append(visitor.toString() + "\n");
                }
                break;
        }
    }

    public static void main(String[] args) {
        VisitorManagementSystem app = new VisitorManagementSystem();
        app.setVisible(true);
    }
}