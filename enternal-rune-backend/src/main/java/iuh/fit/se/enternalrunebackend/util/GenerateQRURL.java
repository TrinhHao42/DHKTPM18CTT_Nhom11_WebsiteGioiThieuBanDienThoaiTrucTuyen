package iuh.fit.se.enternalrunebackend.util;

import iuh.fit.se.enternalrunebackend.config.QRConfig;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;


@Component
public class GenerateQRURL {
    public String getQRURL(QRConfig qrConfig, BigDecimal amount, String description) {
        String acc =  qrConfig.getAcc();
        String bank = qrConfig.getBank();
        String template = qrConfig.getTemplate();
        String download = qrConfig.getDownload();

        String url = "https://qr.sepay.vn/img?acc=" + acc +
                "&bank=" + bank +
                "&amount=" + amount +
                "&des=" + description +
                "&template=" + template +
                "&download=" + download;

        return url;
    }
}
