package iuh.fit.se.enternalrunebackend.entity;

public class ErrorMessage {
    private int status;
    private String message;
    private long timestamp;

    //    public ErrorMessage(int status, String message) {
//        this.status = status;
//        this.message = message;
//        this.timestamp=System.currentTimeMillis();
//    }
    public ErrorMessage(String message) {

        this.message = message;

    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
