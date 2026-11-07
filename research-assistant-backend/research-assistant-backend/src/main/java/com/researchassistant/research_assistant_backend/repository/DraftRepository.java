package com.researchassistant.research_assistant_backend.repository;
import com.researchassistant.research_assistant_backend.entity.Draft; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface DraftRepository extends JpaRepository<Draft,Long>{ List<Draft> findAllByUserEmailOrderByIdDesc(String email); java.util.Optional<Draft> findByIdAndUserEmail(Long id,String email); long countByUserEmail(String email); }
