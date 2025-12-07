package iuh.fit.se.enternalrunebackend.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationCodeService {

    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    private final Map<String, Long> expirationTimes = new ConcurrentHashMap<>();

    // Sinh mã ngẫu nhiên 6 số
    public String generateCode(String email) {
        String code = String.format("%06d", new Random().nextInt(999999));
        verificationCodes.put(email, code);
        expirationTimes.put(email, System.currentTimeMillis() + 5 * 60 * 1000); // Hết hạn sau 5 phút
        return code;
    }

    public boolean verifyCode(String email, String code) {
        String savedCode = verificationCodes.get(email);
        Long expireAt = expirationTimes.get(email);

        if (savedCode == null || expireAt == null) return false;
        if (System.currentTimeMillis() > expireAt) {
            verificationCodes.remove(email);
            expirationTimes.remove(email);
            return false;
        }

        return savedCode.equals(code);
    }

    public void removeCode(String email) {
        verificationCodes.remove(email);
        expirationTimes.remove(email);
    }
}
