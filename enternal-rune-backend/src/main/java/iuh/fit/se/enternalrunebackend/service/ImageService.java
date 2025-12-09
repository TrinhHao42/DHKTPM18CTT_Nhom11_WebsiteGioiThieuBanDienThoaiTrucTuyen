package iuh.fit.se.enternalrunebackend.service;

import java.io.IOException;

public interface ImageService {
    String upload(byte[] imageData, String fileName) throws IOException;
}
