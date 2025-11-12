package iuh.fit.se.enternalrunebackend.service;

public interface EmailService {
    public void sendMessage(String from, String to, String subject, String text);
    public void sendVerificationCode(String toEmail, String code);
}
