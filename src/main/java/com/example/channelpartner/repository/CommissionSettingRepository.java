package com.example.channelpartner.repository;

import com.example.channelpartner.model.CommissionSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommissionSettingRepository extends JpaRepository<CommissionSetting, Long> {

    Optional<CommissionSetting> findByProjectId(Long projectId);

    Optional<CommissionSetting> findByBuilderId(Long builderId);
}
