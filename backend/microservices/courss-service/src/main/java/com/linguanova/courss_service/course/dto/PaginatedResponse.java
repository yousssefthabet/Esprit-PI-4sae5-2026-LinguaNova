package com.linguanova.courss_service.course.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class PaginatedResponse<T> {
    private List<T> items;
    private PaginationMeta pagination;

    @Data
    @AllArgsConstructor
    public static class PaginationMeta {
        private int currentPage;
        private int totalPages;
        private long totalItems;
        private int itemsPerPage;
        private boolean hasNext;
        private boolean hasPrevious;
    }
}
